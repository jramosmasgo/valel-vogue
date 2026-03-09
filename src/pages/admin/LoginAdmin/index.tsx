import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { loginWithEmail } from '@/services/authentication';
import './styles.scss';

const LoginAdmin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await loginWithEmail({ email, password });
            // No need to navigate manually — GuestRoute detects the auth state
            // change via AuthContext and redirects to /admin/products automatically.
        } catch (err: unknown) {
            const msg = (err as { message?: string }).message ?? '';
            if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
                setError('Correo o contraseña incorrectos.');
            } else if (msg.includes('too-many-requests')) {
                setError('Demasiados intentos. Inténtalo más tarde.');
            } else {
                setError('Error al iniciar sesión. Intenta de nuevo.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="login-wrapper">
            <div className="login-header">
                <h1>Bienvenido</h1>
                <p>Ingresa tus credenciales para continuar</p>
            </div>

            <form className="login-form-premium" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Correo Electrónico</label>
                    <div className="input-with-icon">
                        <Mail size={18} />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-with-icon">
                        <Lock size={18} />
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {error && <p className="login-error">{error}</p>}

                <div className="form-options">
                    <label className="checkbox-container">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        Recordarme
                    </label>
                    <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? (
                        <span className="loader"></span>
                    ) : (
                        <>
                            <span>Ingresar</span>
                            <LogIn size={18} />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginAdmin;
