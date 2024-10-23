import { useState } from 'react'
import { Discount, Product } from '../../../types'

interface IProductManagementProps {
  onProductUpdate: (updatedProduct: Product) => void
  onProductAdd: (newProduct: Product) => void
}

export default function useProductManagement({
  onProductUpdate,
  onProductAdd,
}: IProductManagementProps) {
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [newDiscount, setNewDiscount] = useState<Discount>({
    quantity: 0,
    rate: 0,
  })
  const [showNewProductForm, setShowNewProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    stock: 0,
    discounts: [],
  })

  const handleEditProduct = (product: Product) => {
    setEditProduct({ ...product })
  }

  const handleProductNameUpdate = (productId: string, newName: string) => {
    if (editProduct && editProduct.id === productId) {
      setEditProduct({
        ...editProduct,
        name: newName,
      })
    }
  }

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editProduct && editProduct.id === productId) {
      setEditProduct({
        ...editProduct,
        price: newPrice,
      })
    }
  }

  const handleEditComplete = () => {
    if (editProduct) {
      onProductUpdate(editProduct)
      setEditProduct(null)
    }
  }

  const handleStockUpdate = (productId: string, newStock: number) => {
    if (editProduct && editProduct.id === productId) {
      setEditProduct({ ...editProduct, stock: newStock })
    }
  }

  const handleAddDiscount = (productId: string) => {
    if (editProduct && editProduct.id === productId) {
      const newProduct = {
        ...editProduct,
        discounts: [...editProduct.discounts, newDiscount],
      }
      onProductUpdate(newProduct)
      setEditProduct(newProduct)
      setNewDiscount({ quantity: 0, rate: 0 })
    }
  }

  const handleRemoveDiscount = (productId: string, index: number) => {
    if (editProduct && editProduct.id === productId) {
      const newProduct = {
        ...editProduct,
        discounts: editProduct.discounts.filter((_, i) => i !== index),
      }
      onProductUpdate(newProduct)
      setEditProduct(newProduct)
    }
  }

  const handleAddNewProduct = () => {
    onProductAdd({ ...newProduct, id: `p${Date.now()}` })
    setNewProduct({
      name: '',
      price: 0,
      stock: 0,
      discounts: [],
    })
    setShowNewProductForm(false)
  }

  return {
    editProduct,
    newDiscount,
    showNewProductForm,
    newProduct,
    handleEditProduct,
    handleProductNameUpdate,
    handleEditComplete,
    handleStockUpdate,
    handleAddDiscount,
    handleRemoveDiscount,
    handleAddNewProduct,
    setNewDiscount,
    setShowNewProductForm,
    setNewProduct,
    handlePriceUpdate,
  }
}
