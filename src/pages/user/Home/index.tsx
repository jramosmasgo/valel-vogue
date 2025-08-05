import React from 'react'
import * as Dialog from '@radix-ui/react-dialog';
import "./styles.scss"
import CardProduct from '@/components/CardProduct';
import ProductDetails from '@/components/ProductDetails';

const HomeUser: React.FC = () => {
    const [openModal, setOpenModal] = React.useState(false);

    return (
        <div className='home-user'>
            <div className='home-user-navigation'>
                <button>Todos</button>
                <button>Hombres</button>
                <button>Mujeres</button>
                <button>Niños</button>
            </div>
            <div className='home-user-categories'>
                <button className='category-active'>Todos </button>
                <button>Pantalones</button>
                <button>Casacas</button>
                <button>Polos</button>
                <button>Chompas</button>
                <button>Polones</button>
                <button>Faldas</button>
                <button>Calzados</button>
                <button>Camisas</button>
            </div>
            <div className='product-grid'>
                <CardProduct onClick={() => setOpenModal(true)} />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
                <CardProduct />
            </div>
            <div className='home-user-pagination'>
                <button>1</button>
                <button>2</button>
                <button>3</button>
                <button>4</button>
            </div>
            <Dialog.Root open={openModal} onOpenChange={setOpenModal}>
                <ProductDetails />
            </Dialog.Root>
        </div>
    )
}

export default HomeUser; 