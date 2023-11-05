"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const hash_service_1 = require("../../user/hash.service");
const user_service_1 = require("../../user/services/user.service");
let AuthService = class AuthService {
    constructor(userService, hashService, jwtService) {
        this.userService = userService;
        this.hashService = hashService;
        this.jwtService = jwtService;
    }
    async validateUser(email, pass) {
        const user = await this.userService.getUserByEmail(email);
        console.log(user, "io");
        if (user && (await this.hashService.comparePassword(pass, user.password))) {
            return user;
        }
        return null;
    }
    async login(user) {
        console.log(user, "ooi");
        const payload = {
            email: user.email,
            sub: user.id,
            username: user.username,
        };
        return {
            access_token: this.jwtService.sign(payload),
            email: user.email,
            username: user.username,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService,
        hash_service_1.HashService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map