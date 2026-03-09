import React, { useState } from "react";
import {
    MapPin,
    Mail,
    Target,
    Eye,
    Send,
    Instagram,
    Facebook,
    MessageCircle
} from "lucide-react";
import "./styles.scss";

interface ContactForm {
    name: string;
    email: string;
    message: string;
}

const AboutUser: React.FC = () => {
    const [formData, setFormData] = useState<ContactForm>({
        name: "",
        email: "",
        message: "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you for contacting us. We’ll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="about-container">
            {/* Hero Section */}
            <section className="about-hero">
                <div className="hero-content fade-in">
                    <h1 className="hero-title">Nuestra <span>Esencia</span></h1>
                    <p className="hero-subtitle">Moda con propósito, estilo con actitud.</p>
                </div>
            </section>

            {/* Story Section */}
            <section className="about-story">
                <div className="story-grid">
                    <div className="story-image animate-slide-right">
                        <img
                            src="https://fusionmoda.es/wp-content/uploads/que-buscan-los-jovenes-en-la-moda.webp"
                            alt="Valel Vogue Fashion"
                        />
                        <div className="image-overlay"></div>
                    </div>
                    <div className="story-text animate-slide-left">
                        <h2 className="section-title-left">Sobre Nosotros</h2>
                        <p>
                            En <strong>VALEL VOGUE</strong> encontrarás mucho más que ropa: ofrecemos estilo, comodidad y calidad para cada ocasión. Nos especializamos en prendas modernas, versátiles y accesibles, pensadas para resaltar tu personalidad y acompañarte en tu día a día.
                        </p>
                        <p>
                            Desde básicos esenciales hasta colecciones exclusivas, cada pieza está seleccionada con detalle para que te sientas seguro, auténtico y a la moda. Ya sea que busques un look casual, elegante o atrevido, aquí descubrirás lo que necesitas para crear tu propio estilo.
                        </p>
                        <p>
                            Creemos que la moda es una forma de expresión, y cada prenda es una oportunidad para mostrar quién eres con confianza y actitud.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission and Vision */}
            <section className="about-values">
                <div className="values-grid">
                    <div className="value-card animate-up">
                        <div className="value-icon">
                            <Target size={40} />
                        </div>
                        <h3 className="value-title">Misión</h3>
                        <p className="value-text">
                            Ofrecer ropa moderna y de calidad que brinde estilo y confianza. Buscamos inspirar a cada cliente a expresar su esencia a través de una moda accesible y auténtica.
                        </p>
                    </div>
                    <div className="value-card animate-up" style={{ animationDelay: "0.2s" }}>
                        <div className="value-icon">
                            <Eye size={40} />
                        </div>
                        <h3 className="value-title">Visión</h3>
                        <p className="value-text">
                            Ser una marca referente en innovación y calidad, expandiéndonos nacional e internacionalmente para que cada persona marque la diferencia con su manera de vestir.
                        </p>
                    </div>
                </div>
            </section>

            {/* Location & Info */}
            <section className="about-info">
                <h2 className="section-title">Encuéntranos</h2>
                <div className="info-grid">
                    <div className="info-details animate-slide-right">
                        <div className="info-item">
                            <div className="info-icon"><MapPin /></div>
                            <div className="info-content">
                                <h4>Ubicación</h4>
                                <p>Jirón Aguirre Morales N. 855 - El Tambo - Huancayo</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><MessageCircle /></div>
                            <div className="info-content">
                                <h4>WhatsApp</h4>
                                <p>+51 987 654 321</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><Mail /></div>
                            <div className="info-content">
                                <h4>Email</h4>
                                <p>valelvogue@gmail.com</p>
                            </div>
                        </div>
                        <div className="social-links">
                            <a href="#" aria-label="Instagram"><Instagram /></a>
                            <a href="#" aria-label="Facebook"><Facebook /></a>
                        </div>
                    </div>
                    <div className="info-map animate-slide-left">
                        <iframe
                            title="Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d487.73077768016924!2d-75.22343084317048!3d-12.054099661926786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910e963d93b25ca3%3A0xb8d1f941020c933a!2sAguirre%20Morales%20855%2C%2012006!5e0!3m2!1sen!2spe!4v1758731558865!5m2!1sen!2spe"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: "24px" }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="about-contact">
                <div className="contact-wrapper">
                    <div className="contact-header">
                        <h2 className="section-title">Contáctanos</h2>
                        <p>¿Tienes alguna duda o quieres saber más? Escríbenos.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="contact-form-premium animate-up">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Nombre</label>
                                <input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="Tu nombre" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="tuemail@ejemplo.com" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder="Escribe tu mensaje..." rows={4} />
                        </div>
                        <button type="submit" className="premium-button">
                            <span>Enviar Mensaje</span>
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default AboutUser;

