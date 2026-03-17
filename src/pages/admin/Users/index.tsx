import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Phone, X } from 'lucide-react';
import { toast } from 'react-toastify';
import './styles.scss';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/users/users.service';
import type { User, CreateUserData, UserType } from '@/services/users/users.types';

const UsersManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const [formData, setFormData] = useState<CreateUserData>({
        email: '',
        name: '',
        phone: '',
        profileImage: '',
        status: true,
        type: 'user'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        const toastId = toast.loading('Cargando usuarios...');
        try {
            const data = await getUsers();
            setUsers(data);
            toast.update(toastId, { render: 'Usuarios cargados', type: 'success', isLoading: false, autoClose: 2000 });
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.update(toastId, { render: 'Error al cargar usuarios', type: 'error', isLoading: false, autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenModal = (user: User | null = null) => {
        if (user) {
            setIsEditing(true);
            setSelectedUser(user);
            setFormData({
                email: user.email,
                name: user.name,
                phone: user.phone,
                profileImage: user.profileImage,
                status: user.status,
                type: user.type
            });
        } else {
            setIsEditing(false);
            setSelectedUser(null);
            setFormData({
                email: '',
                name: '',
                phone: '',
                profileImage: '',
                status: true,
                type: 'user'
            });
        }
        setModalOpen(true);
    };

    const handleSave = async () => {
        if (!formData.email || !formData.name) {
            toast.warning('Email y nombre son obligatorios');
            return;
        }

        const toastId = toast.loading(isEditing ? 'Actualizando usuario...' : 'Creando usuario...');
        try {
            if (isEditing && selectedUser) {
                await updateUser(selectedUser.id, formData);
                setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
                toast.update(toastId, { render: 'Usuario actualizado correctamente', type: 'success', isLoading: false, autoClose: 3000 });
            } else {
                const newId = await createUser(formData);
                setUsers([...users, { id: newId, ...formData }]);
                toast.update(toastId, { render: 'Usuario creado correctamente', type: 'success', isLoading: false, autoClose: 3000 });
            }
            setModalOpen(false);
        } catch (error) {
            console.error('Error saving user:', error);
            toast.update(toastId, { render: 'Error al guardar usuario', type: 'error', isLoading: false, autoClose: 3000 });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

        const toastId = toast.loading('Eliminando usuario...');
        try {
            await deleteUser(id);
            setUsers(users.filter(u => u.id !== id));
            toast.update(toastId, { render: 'Usuario eliminado correctamente', type: 'success', isLoading: false, autoClose: 3000 });
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.update(toastId, { render: 'Error al eliminar usuario', type: 'error', isLoading: false, autoClose: 3000 });
        }
    };

    return (
        <div className='users-management'>
            <div className='users-header'>
                <div className='header-info'>
                    <h3>Gestión de Usuarios</h3>
                    <p>Administra los accesos y perfiles de los usuarios de la plataforma.</p>
                </div>
                <button className='btn-add' onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    <span>Nuevo Usuario</span>
                </button>
            </div>

            <div className='users-table-container'>
                <div className='table-responsive'>
                    <table>
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Teléfono</th>
                                <th>Tipo</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Cargando...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No hay usuarios registrados.</td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id}>
                                    <td>
                                        <div className='user-cell'>
                                            <img
                                                src={user.profileImage || 'https://via.placeholder.com/40'}
                                                alt={user.name}
                                                className='user-avatar'
                                            />
                                            <div className='user-details'>
                                                <span className='user-name'>{user.name}</span>
                                                <span className='user-email'>{user.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Phone size={14} color="#666" />
                                            {user.phone || 'N/A'}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.type}`}>
                                            {user.type === 'admin' ? 'Administrador' : 'Cliente'}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${user.status ? 'active' : 'inactive'}`}>
                                            {user.status ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className='actions-cell'>
                                            <button className='btn-edit' title='Editar' onClick={() => handleOpenModal(user)}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button className='btn-delete' title='Eliminar' onClick={() => handleDelete(user.id)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className='admin-modal-overlay'>
                    <div className='admin-modal-content' style={{ maxWidth: '500px' }}>
                        <div className='modal-header'>
                            <h3>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h3>
                            <button className='close-btn' onClick={() => setModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className='modal-body'>
                            <div className='form-grid' style={{ gridTemplateColumns: '1fr' }}>
                                <div className='form-group'>
                                    <label className='form-label'>Nombre Completo</label>
                                    <input
                                        className='form-input'
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder='Ej. Jean Ramos'
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>Correo Electrónico</label>
                                    <input
                                        className='form-input'
                                        type='email'
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder='correo@ejemplo.com'
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>Teléfono</label>
                                    <input
                                        className='form-input'
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder='Ej. 123123123'
                                    />
                                </div>
                                <div className='form-group'>
                                    <label className='form-label'>URL de Imagen de Perfil</label>
                                    <input
                                        className='form-input'
                                        value={formData.profileImage}
                                        onChange={e => setFormData({ ...formData, profileImage: e.target.value })}
                                        placeholder='https://...'
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div className='form-group'>
                                        <label className='form-label'>Tipo de Usuario</label>
                                        <select
                                            className='form-input'
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value as UserType })}
                                        >
                                            <option value='user'>Cliente</option>
                                            <option value='admin'>Administrador</option>
                                        </select>
                                    </div>
                                    <div className='form-group'>
                                        <label className='form-label'>Estado</label>
                                        <select
                                            className='form-input'
                                            value={formData.status ? 'true' : 'false'}
                                            onChange={e => setFormData({ ...formData, status: e.target.value === 'true' })}
                                        >
                                            <option value='true'>Activo</option>
                                            <option value='false'>Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button className='btn-cancel' onClick={() => setModalOpen(false)}>Cancelar</button>
                            <button className='btn-save' onClick={handleSave}>
                                {isEditing ? 'Guardar Cambios' : 'Crear Usuario'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersManagement;
