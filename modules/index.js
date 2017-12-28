import { UserModule } from './user';
import { ProductModule } from './product';

export class Modules {
    constructor() {
        this.user = new UserModule;
        this.product = new ProductModule;
        this.moduleList = [
            this.user,
            this.product
            ];
    }
}