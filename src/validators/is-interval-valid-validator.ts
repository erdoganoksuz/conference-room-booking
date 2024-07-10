import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsTimeInterval', async: false })
export class IsTimeIntervalConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;

    const startTime = new Date(value);
    const endTime = new Date((args.object as any)[relatedPropertyName]);

    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return false;
    }

    const startMinutes = startTime.getMinutes();
    const endMinutes = endTime.getMinutes();

    const isValidInterval = (minutes: number) => minutes % 15 === 0;

    if (!isValidInterval(startMinutes) || !isValidInterval(endMinutes)) {
      return false;
    }

    const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    return diff % 15 === 0;
  }

  defaultMessage() {
    return 'Both time must be in intervals of 15 minutes';
  }
}

export function IsTimeInterval(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsTimeIntervalConstraint,
    });
  };
}
