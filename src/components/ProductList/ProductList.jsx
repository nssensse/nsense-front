import React, {useCallback, useEffect, useState} from "react"
import "./ProductList.css"
import ProductItem from "../ProductItem/ProductItem"
import {useTelegram} from "../../hooks/useTelegram"

const products = [
    {id: "1", title: "Джинсы 1337", price: 5000, description: "Синего цвета, прямые"},
    {id: "2", title: "Куртка", price: 12000, description: "Зеленого цвета, теплая"},
    {id: "3", title: "Джинсы 2", price: 5000, description: "Синего цвета, прямые"},
    {id: "4", title: "Куртка 8", price: 122, description: "Зеленого цвета, теплая"},
    {id: "5", title: "Джинсы 3", price: 5000, description: "Синего цвета, прямые"},
    {id: "6", title: "Куртка 7", price: 600, description: "Зеленого цвета, теплая"},
    {id: "7", title: "Джинсы 4", price: 5500, description: "Синего цвета, прямые"},
    {id: "8", title: "Куртка 5", price: 12000, description: "Зеленого цвета, теплая"},
]

const getTotalPrice = (products) => {
    return products.reduce((acc, item) => {
        return acc + item.price
    }, 0)
}

const ProductList = () => {
    const [addedProducts, setAddedProducts] = useState([])
    const {tg, queryId} = useTelegram()

    const onSendData = useCallback(() => {
        const data = {
            products: addedProducts,
            totalPrice: getTotalPrice(addedProducts),
            queryId,
        }

        fetch("http://92.53.88.98:8000/web-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
    }, [addedProducts])

    useEffect(() => {
        tg.onEvent("mainButtonClicked", onSendData)

        return () => {
            tg.offEvent("mainButtonClicked", onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedProducts.find(item => item.id === product.id)
        let newItems = []

        if (alreadyAdded) {
            newItems = addedProducts.filter(item => item.id !== product.id)
        } else {
            newItems = [...addedProducts, product]
        }

        setAddedProducts(newItems)

        if (newItems.length === 0) {
            tg.MainButton.hide()
        } else {
            tg.MainButton.show()
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }
    return (
        <div className="list">
            {products.map(item =>
                <ProductItem key={item.id} product={item} onAdd={onAdd} className="item"/>
            )}
        </div>
    )
}

export default ProductList