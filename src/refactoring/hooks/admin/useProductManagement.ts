import { useState } from 'react'
import { Discount, Product } from '../../../types'
import {
  addDiscountToProduct,
  createProduct,
  getInitialDiscountState,
  getInitialProductState,
  removeDiscountFromProduct,
  updateProductField,
} from '../utils/adminUtils'

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
    if (editProduct?.id === productId) {
      setEditProduct(updateProductField(editProduct, 'name', newName))
    }
  }

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    if (editProduct?.id === productId) {
      setEditProduct(updateProductField(editProduct, 'price', newPrice))
    }
  }

  const handleEditComplete = () => {
    if (editProduct) {
      onProductUpdate(editProduct)
      setEditProduct(null)
    }
  }

  const handleStockUpdate = (productId: string, newStock: number) => {
    if (editProduct?.id === productId) {
      setEditProduct(updateProductField(editProduct, 'stock', newStock))
    }
  }

  const handleAddDiscount = (productId: string) => {
    if (editProduct?.id === productId) {
      const updatedProduct = addDiscountToProduct(editProduct, newDiscount)
      onProductUpdate(updatedProduct)
      setEditProduct(updatedProduct)
      setNewDiscount(getInitialDiscountState())
    }
  }

  const handleRemoveDiscount = (productId: string, index: number) => {
    if (editProduct?.id === productId) {
      const updatedProduct = removeDiscountFromProduct(editProduct, index)
      onProductUpdate(updatedProduct)
      setEditProduct(updatedProduct)
    }
  }

  const handleAddNewProduct = () => {
    const createdProduct = createProduct(newProduct)
    onProductAdd(createdProduct)
    setNewProduct(getInitialProductState())
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
