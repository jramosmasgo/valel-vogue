import React, { useState } from "react";
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
            <section>
                <div className="about-title">
                    <h1>Sobre Nosotros</h1>
                </div>
            </section>
            <section className="about-description">
                <img src="https://fusionmoda.es/wp-content/uploads/que-buscan-los-jovenes-en-la-moda.webp" alt="" />
                <p className="section-text">
                    En <b>VALEL VOGUE</b>  encontrarás mucho más que ropa: ofrecemos estilo, comodidad y calidad para cada ocasión. Nos especializamos en prendas modernas, versátiles y accesibles, pensadas para resaltar tu personalidad y acompañarte en tu día a día.
                    Desde básicos esenciales hasta colecciones exclusivas, cada pieza está seleccionada con detalle para que te sientas seguro, auténtico y a la moda. Ya sea que busques un look casual, elegante o atrevido, aquí descubrirás lo que necesitas para crear tu propio estilo.
                    En VALEL VOGUE creemos que la moda es una forma de expresión, y cada prenda es una oportunidad para mostrar quién eres con confianza y actitud. </p>
            </section>

            {/* Location */}
            <section className="about-section" >
                <h2 className="section-title">Ubicanos</h2>
                <section className="about-grid">
                    <div className="">
                        <br />
                        <iframe
                            title="Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d487.73077768016924!2d-75.22343084317048!3d-12.054099661926786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x910e963d93b25ca3%3A0xb8d1f941020c933a!2sAguirre%20Morales%20855%2C%2012006!5e0!3m2!1sen!2spe!4v1758731558865!5m2!1sen!2spe"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <div className="about-section">
                        <ul className="company-list">
                            <li><strong>Ubicacion:</strong> Jiron Aguirre Morales N. 855 - El Tambo - Huancayo</li>
                            <li><strong>Nuestro Nombre:</strong> Valel Vogue</li>
                            <li><strong> Whatsapp:</strong> +51 987 654 321</li>
                            <li><strong>Email:</strong> valelbogue@gmail.com </li>
                        </ul>
                    </div>
                </section>
            </section>
            {/* Mission and Vision */}
            <section className="about-section">
                <section className="about-grid">
                    <div className="about-card">
                        <h2 className="card-title">Misión</h2>
                        <p className="card-text">
                            En VALEL VOGUE nos dedicamos a ofrecer ropa moderna, versátil y de calidad, pensada para brindar estilo, comodidad y confianza a cada cliente. Buscamos que nuestras prendas no solo vistan, sino que también inspiren a expresar la personalidad y esencia de quienes las usan, creando experiencias únicas a través de la moda accesible y auténtica.
                        </p>
                    </div>
                    <div className="about-card">
                        <h2 className="card-title">Visión</h2>
                        <p className="card-text">
                            Ser reconocidos como una marca de referencia en el mundo de la moda, destacando por nuestro compromiso con la innovación, la calidad y la cercanía con nuestros clientes. Aspiramos a expandirnos y consolidarnos en el mercado nacional e internacional, llevando el estilo VALEL VOGUE a cada persona que desee marcar la diferencia con su manera de vestir.
                        </p>
                    </div>
                </section>
            </section>

            {/* Contact Form */}
            <section className="about-section">
                <h2 className="section-title">Contactanos</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Nombre
                        </label>
                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-input"
                            placeholder="tuemail@ejemplo.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message" className="form-label">
                            Mensaje
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="form-textarea"
                            placeholder="Escribe tu mensaje..."
                            rows={4}
                        />
                    </div>

                    <button type="submit" className="form-button">
                        Enviar
                    </button>
                </form>
            </section>
        </div>
    );
};

export default AboutUser;
