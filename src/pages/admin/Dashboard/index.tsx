import React, { useEffect, useState } from 'react';
import { Package, AlertCircle, Eye, Activity } from 'lucide-react';
import { getProducts } from '@/services/product/product.service';
import './styles.scss';

const AdminDashboard: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        unavailable: 0,
        total: 0,
        views: 0
    });

    useEffect(() => {
        const fetchMetrics = async () => {
            setIsLoading(true);
            try {
                const products = await getProducts();

                const unavailable = products.filter(p => !p.available).length;
                const total = products.length;
                const views = products.reduce((acc, curr) => acc + (curr.views || 0), 0);

                setMetrics({ unavailable, total, views });
            } catch (error) {
                console.error("Error fetching dashboard metrics", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    return (
        <div className="admin-overview">
            <div className="overview-header">
                <h3>Resumen General</h3>
                <p>Métricas principales de los productos en tu catálogo.</p>
            </div>

            {isLoading ? (
                <div className="loading-state">Cargando métricas...</div>
            ) : (
                <div className="metrics-grid">
                    <div className="metric-card pattern-1">
                        <div className="metric-icon">
                            <AlertCircle size={24} />
                        </div>
                        <div className="metric-info">
                            <span className="metric-value">{metrics.unavailable}</span>
                            <span className="metric-label">Productos No Disponibles</span>
                        </div>
                    </div>

                    <div className="metric-card pattern-2">
                        <div className="metric-icon">
                            <Package size={24} />
                        </div>
                        <div className="metric-info">
                            <span className="metric-value">{metrics.total}</span>
                            <span className="metric-label">Prendas Registradas</span>
                        </div>
                    </div>

                    <div className="metric-card pattern-3">
                        <div className="metric-icon">
                            <Eye size={24} />
                        </div>
                        <div className="metric-info">
                            <span className="metric-value">{metrics.views}</span>
                            <span className="metric-label">Vistas Totales</span>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="empty-state">
                    <Activity size={48} className="empty-icon" />
                    <h4>Todo funcionando correctamente</h4>
                    <p>Mantienes tu catálogo y métricas actualizadas.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
