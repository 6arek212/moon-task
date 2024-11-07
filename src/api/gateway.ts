
import express, { json, Express } from 'express'
import router from './endpoints';


/**
 * Main API class that proves resolving and wrapping of various endpoints and methods.
 * New endpoint can be implemented and placed in `endpoints` folder
 */
class Gateway {
  private readonly app: Express
  private readonly port: number

  constructor(port: number) {
    this.port = port;
    this.app = express()
      .use(express.urlencoded({ extended: true }))
      .use(json())
      .use('/api', router)
  }

  start() {
    this.app.on("error", (err) => console.log(err));
    this.app.listen(this.port, this.onListening)
  }

  onListening = () => {
    console.log(
      `
      ################################################
      🛡️  Server listening on port: ${this.port} 🛡️
              
              http://localhost:${this.port}/api/
      ################################################
    `
    )
  }
}

export default Gateway;