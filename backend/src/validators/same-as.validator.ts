import { registerDecorator, type ValidationOptions } from 'class-validator';

export function SameAs(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object, propertyName: any) {
    registerDecorator({
      name: 'sameAs',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value, args) {
          const [relatedPropertyName] = args!.constraints;

          return args?.object[relatedPropertyName] === value;
        },
        defaultMessage() {
          return '$property must match $constraint1';
        },
      },
    });
  };
}
