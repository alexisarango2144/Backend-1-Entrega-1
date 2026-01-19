import {v4 as uuidv4} from 'uuid';
import fs from 'fs';

class Product {
    constructor(title, description, code, price, thumbnails = [], category = null, stock, status = true) {
      this.id = uuidv4();
      this.title = title;
      this.description = description;
      this.code = code;
      this.price = price;
      this.thumbnails = thumbnails;
      this.category = category;
      this.stock = stock;
      this.status = status
    }
  } 

export default class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    
    if(!fs.existsSync(this.path)) {
      fs.writeFileSync(this.path, "[]")
    };

    const content = fs.readFileSync(this.path, "utf-8");
    if(content) this.products = JSON.parse(content);
  }

  async saveProducts(){
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Ocurrió un error al almacenar la información', error)
    }
  }

  async addProduct(product) {
    try {
      if (!product.title || !product.description || !product.code || !product.price || !product.stock) {
        throw new Error("Faltan campos obligatorios");
      }
   
      this.products.push(product);
      // fs.writeFileSync(this.path, JSON.stringify(this.products));
      await this.saveProducts();
      return product;
    } catch (error) {
      throw new Error("Error creando el producto", error);
    }
  }

  async getProducts() {
    try {
      if (this.products.length === 0) {
        throw new Error("No se encontraron productos");
      }
      return this.products;
    } catch (error) {
      throw new Error('Ocurrió un error obteniendo los productos: ', error);
    }
  }

  async getProductById(id) {
    try {
      const product = this.products.find((product) => product.id === id);
      if (!product) {
        throw new Error("Producto no encontrado");
      }
      return product;
    } catch (error) {
      throw new Error('Ocurrió un error obteniendo el producto: ', error.message);
    }
  }

  async updateProductById(id, content) {
    try {
      const product = await this.getProductById(id);
      if(!product) throw new Error("Producto no encontrado");

      if(content.id) throw new Error("El ID es autogenerado y no se puede actualizar");

      const products = await this.getProducts();
      const indexToUpdate = products.findIndex((prod) => prod.id === id);

      if(indexToUpdate === -1) {
        throw new Error("No se encontró el producto a actualizar.")
      }
      products[indexToUpdate] = {...product, ...content};
      await this.saveProducts();
      return products[indexToUpdate];
    } catch (error) {
      throw new Error("Ocurrió un error actualizando el producto: ", error)
    }
  }

  async softDeleteProduct(id) {
    try {
      await this.updateProductById(id, {status: false});
      return 'Producto eliminado con éxito.';
    } catch (error) {
      throw new Error('Ocurrió un error realizando el eliminado lógico del producto: ', error)
    }
  }

  async hardDeleteProduct(id) {
    try {
      const product = await this.getProductById(id);
      if(!product) throw new Error("No se encontró el item a eliminar.")
      const products = await this.getProducts();

      const indexToUpdate = await products.findIndex((prod)=> prod.id === id);

      const result = await products.splice(indexToUpdate, 1);
      await this.saveProducts();
      return 'Producto eliminado permanentemente.';
    } catch (error) {
      throw new Error('Ocurrió un error realizando el eliminado definitivo del producto: ', error)
    }
  }
}

console.clear();

export const productsManager = new ProductManager('./src/data/products.json');


// console.log(await productsManager.addProduct(new Product('Pimienta negra', 'Pimienta negra molida', '045211015', 8790, [], 'Especias', 45, true)));
// console.log(await productsManager.addProduct(new Product('Comino molido', 'Comino molido', '0452141', 4390, [], 'Especias', 28, true)));
// console.log(await productsManager.addProduct(new Product('Canela en astillas', 'Canela en astillas lista para usar', '1055284', 5270, ['https://eatsymarket.com/cdn/shop/files/CanelaenAstillas_1_720x.webp?v=1707746655','https://carulla.vtexassets.com/arquivos/ids/23980111/Canela-Badia-142g-Rama-887991_a.jpg?v=638986378531700000'], 'Especias', 2, true)));

// console.log(await productsManager.getProducts());

// console.log(await productsManager.getProductById('b75a36cb-038e-40f7-9f1e-a1cb16278807'));

// console.log('Producto actualizado: ', await productsManager.updateProductById('cc2e1da3-92a7-4d19-b7a3-62b56fdcfb85', {status: false}))

// console.log(await productsManager.hardDeleteProduct('cc2e1da3-92a7-4d19-b7a3-62b56fdcfb85'));
