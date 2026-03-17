import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { updateUser } from '@/services/users/users.service';
import { toast } from 'react-toastify';
import { Save, Camera, Loader2 } from 'lucide-react';
import { uploadImage } from '@/services/cloudinary.service';
import './styles.scss';

const ProfilePage: React.FC = () => {
    const { userProfile } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        profileImage: '',
    });

    useEffect(() => {
        if (userProfile) {
            setFormData({
                name: userProfile.name || '',
                phone: userProfile.phone || '',
                profileImage: userProfile.profileImage || '',
            });
        }
    }, [userProfile]);

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userProfile) return;

        // Validar tamaño (máx 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('La imagen es demasiado grande (máx 5MB)');
            return;
        }

        setIsUploadingImage(true);
        const toastId = toast.loading('Subiendo imagen...');

        try {
            // 1. Subir a Cloudinary
            const response = await uploadImage(file);
            const newImageUrl = response.secure_url;

            // 2. Actualizar estado local
            setFormData(prev => ({ ...prev, profileImage: newImageUrl }));

            // 3. Actualizar Firestore inmediatamente para la foto
            await updateUser(userProfile.id, { profileImage: newImageUrl });

            toast.update(toastId, {
                render: 'Imagen de perfil actualizada',
                type: 'success',
                isLoading: false,
                autoClose: 2000
            });
        } catch (error) {
            console.error('Upload error:', error);
            toast.update(toastId, {
                render: 'Error al subir la imagen',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setIsUploadingImage(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile) return;

        if (!formData.name) {
            toast.warning('El nombre es obligatorio');
            return;
        }

        setIsLoading(true);
        const toastId = toast.loading('Actualizando perfil...');

        try {
            await updateUser(userProfile.id, formData);
            toast.update(toastId, {
                render: 'Perfil actualizado correctamente',
                type: 'success',
                isLoading: false,
                autoClose: 3000
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.update(toastId, {
                render: 'Error al actualizar el perfil',
                type: 'error',
                isLoading: false,
                autoClose: 3000
            });
        } finally {
            setIsLoading(false);
        }
    };

    const initials = userProfile?.name
        ? userProfile.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '??';

    return (
        <div className='profile-page'>
            <div className='profile-header'>
                <h3>Mi Perfil</h3>
                <p>Gestiona tu información personal y presencia en la plataforma.</p>
            </div>

            <div className='profile-card'>
                <div className='card-body'>
                    <div className='avatar-section'>
                        <div className='avatar-container' style={{ position: 'relative' }}>
                            {formData.profileImage ? (
                                <img src={formData.profileImage} alt={formData.name} />
                            ) : (
                                <div className='avatar-placeholder'>{initials}</div>
                            )}

                            {isUploadingImage && (
                                <div className='avatar-upload-overlay' style={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'rgba(0,0,0,0.4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    borderRadius: 'inherit'
                                }}>
                                    <Loader2 className="animate-spin" />
                                </div>
                            )}
                        </div>
                        <div className='avatar-info'>
                            <h4>{userProfile?.name}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                                <span>{userProfile?.type === 'admin' ? 'Administrador' : 'Usuario'}</span>
                                <button
                                    type="button"
                                    className="btn-change-photo"
                                    onClick={triggerFileInput}
                                    disabled={isUploadingImage}
                                    style={{
                                        background: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.85rem',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <Camera size={16} />
                                    {isUploadingImage ? 'Subiendo...' : 'Cambiar Foto'}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageUpload}
                                />
                            </div>
                        </div>
                    </div>

                    <form className='profile-form' onSubmit={handleSave}>
                        <div className='form-grid'>
                            <div className='form-group full-width'>
                                <label className='form-label'>Nombre Completo</label>
                                <input
                                    className='form-input'
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder='Tu nombre completo'
                                    required
                                />
                            </div>

                            <div className='form-group'>
                                <label className='form-label'>Correo Electrónico</label>
                                <input
                                    className='form-input'
                                    value={userProfile?.email}
                                    disabled
                                    title='El correo electrónico no se puede cambiar'
                                />
                                <small style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                                    El correo electrónico está vinculado a tu cuenta y no puede ser modificado.
                                </small>
                            </div>

                            <div className='form-group'>
                                <label className='form-label'>Teléfono / WhatsApp</label>
                                <input
                                    className='form-input'
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder='Ej. +51 999 888 777'
                                />
                            </div>
                        </div>

                        <div className='actions'>
                            <button
                                type='submit'
                                className='btn-save'
                                disabled={isLoading}
                            >
                                <Save size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                <span>Guardar Cambios</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
