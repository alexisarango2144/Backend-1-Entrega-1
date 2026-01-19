import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import ProductManager from "./ProductManager.js";

class prodToCart {
  constructor(productId, quantity = 1) {
    if (quantity > 0) {
      return {
        product: productId,
        quantity: quantity
      }
    } else {
      return {};
    }
  }
}

class Cart {
  constructor(
    products = [],
    owner = "guest",
    status = true,
    purchased = false
  ) {
    this.id = uuidv4();
    this.products = products;
    this.owner = owner;
    this.createdOn = new Date();
    this.updatedAt = new Date();
    this.status = status;
    this.purchased = purchased;
  }
}

export default class CartManager {
  constructor(path) {
    this.path = path;
    this.carts = [];
    this.productsManager = new ProductManager("./src/data/products.json");

    if (!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]");
    }

    const content = fs.readFileSync(this.path, "utf-8");
    if (content) this.carts = JSON.parse(content);
  }

  async saveCarts() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("Ocurrió un error al almacenar la información", error);
    }
  }

  async addCart(prodId = '', quantity = 1) {
    try {
      const cart = new Cart();
      this.carts.push(cart);

      // if (!cart.products.length) {
      //   throw new Error(
      //     "El carrito se encuentra vacío. Agregue productos al carrito para almacenarlo."
      //   );
      // }

      if (prodId) await this.addProdToCart(cart.id, ...Object.values(new prodToCart(prodId, quantity)));

      // const mappedCartProducts = cart.products.map((prod) => {
      //   return new prodToCart({prod});
      // });

      // const newCartProducts = mappedCartProducts.filter((prod) => Object.keys(prod).length > 0);

      // cart.products = {...newCartProducts}; 
      await this.saveCarts();
      return cart;
    } catch (error) {
      throw new Error("Error creando el carrito", error);
    }
  }

  async getCarts() {
    try {
      if (this.carts.length === 0) {
        throw new Error("No se encontraron carritos");
      }
      return this.carts;
    } catch (error) {
      throw new Error("Ocurrió un error obteniendo los carritos: ", error);
    }
  }

  async getCartById(id) {
    try {
      const cart = this.carts.find((basket) => basket.id === id);
      if (!cart) {
        throw new Error("El carrito no existe");
      }
      return cart;
    } catch (error) {
      console.error("No se encontró el carrito: ", error);
    }
  }

  async getProductsInCartById(id) {
    try {
      const cart = this.carts.find((basket) => basket.id === id);
      if (!cart) {
        throw new Error("El carrito no existe");
      }
      return cart.products;
    } catch (error) {
      console.error("No se encontró el carrito: ", error);
    }
  }

  async updateCartById(id, content) {
    try {
      const cart = await this.getCartById(id);
      if (!cart) throw new Error("Carrito no encontrado");

      if (content.id)
        throw new Error("El ID es autogenerado y no se puede actualizar");
      if (content.products.length === 0) {
        this.deleteCartById(id);
        throw new Error(
          "El carrito no contiene productos, se eliminó automáticamente"
        );
      }

      const carts = await this.getCarts();
      const indexToUpdate = carts.findIndex((basket) => basket.id === id);

      if (indexToUpdate === -1) {
        throw new Error("No se encontró el carrito a actualizar.");
      }
      content.updatedAt = new Date();
      carts[indexToUpdate] = { ...cart, ...content };
      await this.saveCarts();
      return carts[indexToUpdate];
    } catch (error) {
      console.error("Ocurrió un error actualizando el producto. ", error);
    }
  }

  async addProdToCart(cartId, prodId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const product = await this.productsManager.getProductById(prodId);

    if (!product) throw new Error('No se encontró el producto');

    const prodInCart = cart.products.find((prod) => prod.product === prodId);

    if (prodInCart) {
      if (product.stock < (quantity + prodInCart.quantity)) throw new Error('El stock del producto no es suficiente');

      const indexToUpdate = cart.products.findIndex((prod) => prod.product === prodId);

      cart.products[indexToUpdate].quantity += quantity;
    } else {
      if (product.stock < quantity) throw new Error('El stock del producto no es suficiente');

      cart.products.push(new prodToCart(prodId, quantity))
    }
    await this.saveCarts();
    return cart;
  }

  async deleteCartById(id) {
    try {
      const cart = await this.getCartById(id);
      const carts = this.carts;

      const indexToUpdate = await carts.findIndex((basket) => basket.id === id);

      const result = await carts.splice(indexToUpdate, 1);
      if (!result) throw new Error("No se encontró el carrito a eliminar.");
      await this.saveCarts();
      return "Carrito eliminado permanentemente.";
    } catch (error) {
      console.error(
        "Ocurrió un error realizando el eliminado definitivo del carrito.",
        error
      );
    }
  }
}

console.clear();

const cartManager = new CartManager("./src/data/carts.json");

// const newCart = new Cart(['a29853eb-22bc-4157-afbb-a7761ef31e04'], 'alexisarango2144');

// console.log(await cartManager.addCart('a29853eb-22bc-4157-afbb-a7761ef31e04'));
// console.log(await cartManager.addCart());

// console.log(await cartManager.getCarts());
// console.log(await cartManager.getProductsInCartById('8d41052a-115a-405c-818e-462cfea03e69'));

console.log(await cartManager.addProdToCart(
  "8d41052a-115a-405c-818e-462cfea03e69",
  "a29853eb-22bc-4157-afbb-a7761ef31e04", 3
));