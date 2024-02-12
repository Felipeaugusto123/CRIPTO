import { Link } from 'react-router-dom'
import styles from './notFound.module.css'


export function NotFound(){
    return(
        <div className={styles.container}>
            <h1>Pagina 404 nao EXISTE</h1>
            <Link to='/' >
                Acessar Cripto Moedas
            </Link>
        </div>
    )
}