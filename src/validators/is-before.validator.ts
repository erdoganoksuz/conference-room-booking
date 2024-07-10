import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isBefore', async: false })
class IsBeforeConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const startDate = new Date(args.object[args.constraints[0]]);
    const endDate = new Date(value);
    return startDate < endDate;
  }

  defaultMessage(args: ValidationArguments) {
    const relatedProperty = args.constraints[0];
    return `${args.property} must be after ${relatedProperty}`;
  }
}

export function IsBefore(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsBeforeConstraint,
    });
  };
}
