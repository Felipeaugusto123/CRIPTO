import { useEffect, useState } from 'react';
import styles from './detail.module.css'
import { useParams,useNavigate } from 'react-router-dom'

interface CoinProp {
    symbol: string;
    name: string;
    price: string;
    market_cap: string;
    low_24h: string;
    high_24: string;
    total_volume_24: string;
    delta_24h: string;
    formatedPrice: string;
    formatedMarket: string;
    formatedLowPrice: string;
    formatedHighPrice: string;
    numberDelta:number;
    error?: string;
    

}

export function Detail() {
    const { cripto } = useParams();
    const [detail, setDetail] = useState<CoinProp>();
    const [loadig, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        function getData() {
            fetch(`https://sujeitoprogramador.com/api-cripto/coin/?key=b4cd8f8fb3de94c6&symbol=${cripto}`) //peguei a api apenas com as informacoes da moeda que eu escolhi ou seja cripto que foi oq eu passei pelo routes
                .then(response => response.json())
                .then((data: CoinProp) => { //eu fiz direto aqui diferentte da home pq lembre que aqui estou pegando uma moeda apenas,ja na home estavamos pegando todas as moedas

                    if(data.error){
                        navigate("/")
                    }

                    let price = Intl.NumberFormat("pt-BR", { //funcao para formatar para real
                        style: "currency",
                        currency: "BRL"
                    })

                    const resultData = {
                        ...data, //coloquei o valor formatado junto com oq busquei da api
                        formatedPrice: price.format(Number(data.price)),
                        formatedMarket: price.format(Number(data.market_cap)),
                        formatedLowPrice: price.format(Number(data.low_24h)),
                        formatedHighPrice: price.format(Number(data.high_24)),
                        numberDelta: parseFloat(data.delta_24h.replace(",",".")) //fiz esta troca de VIRGULA para ponto pq o js nao reconhece numeros com VIRGULA apenas com PONTO ent para dar certo a comparacao de maior ou menos que 0 para mudar a cor tetmos que fazer isto
                    }
                    setDetail(resultData); //coloquei o valor formatado como detail
                    setLoading(false); //setei o loading para falso
                })
        }

        getData()
    }, [cripto])//caso o cript mude ele vai chamar novamente o useeffect


    if (loadig) { //se o loading estiver true ent coloque isso como eu setei o loading para falso dps de carregar a api ent sempre que a api for gerada a api nao carregara
        return (
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando informações</h4>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.center}>{detail?.name}</h1>
            <p className={styles.center}>{detail?.symbol}</p>

            <section className={styles.content}>
                <p>
                    <strong>Preço:</strong>{detail?.formatedPrice}
                </p>
                <p>
                    <strong>Maior Preço 24h:</strong>{detail?.formatedHighPrice}
                </p>
                <p>
                    <strong>Menor Preço 24h:</strong>{detail?.formatedLowPrice}
                </p>
                <p>
                    <strong>Delta 24h:</strong>
                    <span className={detail?.numberDelta && detail.numberDelta >= 0 ? styles.profit : styles.loss}>
                        {detail?.delta_24h}
                    </span>
                </p>
                <p>
                    <strong>Valor total de mercado:</strong>{detail?.formatedMarket}
                </p>
                
            </section>
        </div>
    )
}