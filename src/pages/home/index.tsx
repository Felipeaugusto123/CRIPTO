import { FormEvent, useEffect, useState } from 'react'
import styles from './home.module.css'
import { Link,useNavigate} from 'react-router-dom'
import { BiSearch } from 'react-icons/bi'

//https://sujeitoprogramador.com/api-cripto/?key=6df8ce7ebf86e668


interface CoinProps {
    name: string;
    delta_24h: string;
    price: string;
    symbol: string;
    volume_24h: string; //os intens dentro de cada moeda
    market_cap: string;
    formatedPrice: string;
    formatedMarket: string;
    numberDelta?:number

}

interface DataProps {
    coins: CoinProps[] //o item do array que tem o coinprops
}

export function Home() {
    const [coins, setCoins] = useState<CoinProps[]>([])
    const [inputValue,SetInputValue] = useState("")
    const navigate = useNavigate();


    useEffect(() => {
        function getData() {
            fetch('https://sujeitoprogramador.com/api-cripto/?key=b4cd8f8fb3de94c6&pref=BRL') //peguei a api
                .then(response => response.json())//se der certo transforme em array
                .then((data: DataProps) => { //se der certo  faça tudo isso a baixo [o DataProps é o tipo que tem o CoinProps,pq o data é a api ent ela tera tudo isso de coinProps]
                    let coinsData = data.coins.slice(0, 15) //separei a api em apenas 15 itens

                    
                    let price = Intl.NumberFormat("pt-BR", { //funcao para formatar para real
                        style: "currency",
                        currency: "BRL"
                    })

                    const formatResult = coinsData.map((item) => { //percorri o array
                        const formated = {//coloquei que quero cirar uma nova categoria dentro do item que seria o array,a nova categoria sera o item formatado
                            ...item,
                            formatedPrice: price.format(Number(item.price)), //formatei o valor de mercado e o preco para real 
                            formatedMarket: price.format(Number(item.market_cap)),
                            numberDelta: parseFloat(item.delta_24h.replace(",","."))//fiz esta troca de VIRGULA para ponto pq o js nao reconhece numeros com VIRGULA apenas com PONTO ent para dar certo a comparacao de maior ou menos que 0 para mudar a cor tetmos que fazer isto
                        }

                        return formated; //retornei para formatResult todos os parametros da funcao com os dois que eu criei formatado para real,ou seja agr o array API tem mais os dois q criei dentro de formatResult
                    })


                    setCoins(formatResult)
                })
        }

        getData()

    }, [])

    function handdleSearch(e:FormEvent){
        e.preventDefault();
        if(inputValue ==='') return;

        navigate(`/detail/${inputValue}`)


        
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handdleSearch}>
                <input
                    placeholder='Digite o simbolo da moeda: BTC...'
                    value={inputValue}
                    onChange={(e)=>SetInputValue(e.target.value)}
                />
                <button type='submit'>
                    <BiSearch size={30} color='#fff' />
                </button>

            </form>

            <table>
                <thead>
                    <tr>
                        <th scope='col'>Moeda</th>
                        <th scope='col'>Valor mercado</th>
                        <th scope='col'>Preço</th>
                        <th scope='col'>Volume</th>
                    </tr>
                </thead>

                <tbody id='tbody'>
                    {coins.map(coin => (
                        <tr key={coin.name} className={styles.tr}>
                            <td className={styles.tdLabel} data-label="Moeda">
                                <Link className={styles.link} to={`/detail/${coin.symbol}`}>
                                    <span>{coin.name}</span> | {coin.symbol}
                                </Link>
                            </td>
                            <td className={styles.tdLabel} data-label="Mercado">
                                {coin.formatedMarket}
                            </td>
                            <td className={styles.tdLabel} data-label="Preço">
                                {coin.formatedPrice}
                            </td>
                            <td className={coin.numberDelta && coin.numberDelta >= 0 ? styles.tdProfit : styles.tdLoss} data-label="Volume">
                                <span>{coin.delta_24h}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>



        </main>
    )
}