import { UserModule } from './user';
import { ProductModule } from './product';
import { PasswordModule } from './password';
import { OrderModule } from './order';

export class Modules {
    constructor() {
        this.user = new UserModule;
        this.product = new ProductModule;
        this.password = new PasswordModule;
        this.order = new OrderModule;
        this.moduleList = [
            this.user,
            this.product,
            this.password,
            this.order
            ];
    }
}