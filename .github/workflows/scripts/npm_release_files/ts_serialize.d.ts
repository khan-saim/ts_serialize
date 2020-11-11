declare module "@gamebridgeai/ts_serialize" {
  /** A JSON object where each property value is a simple JSON value. */
  export type JsonObject = { [Key in string]?: JsonValue };

  /** A JSON array where each value is a simple JSON value. */
  export interface JsonArray extends Array<JsonValue> {}

  /** A property value in a JSON object. */
  export type JsonValue =
    | string
    | number
    | boolean
    | null
    | JsonObject
    | JsonArray;

  /** to be implemented by external authors on their models  */
  export interface TransformKey {
    /** a function that will be called against
   * every property key transforming the key
   * with the provided function
   */
    tsTransformKey(key: string): string;
  }

  /** Adds methods for serialization */
  export abstract class Serializable {
    public tsTransformKey?(key: string): string;
    public toJson(): string;
    public fromJson(json: string | JsonValue): this;
  }

  /** Functions used when hydrating data */
  export type FromJsonStrategy = (value: JsonValue) => any;

  /** Functions used when dehydrating data */
  export type ToJsonStrategy = (value: any) => JsonValue;

  /** string/symbol property name or options for (de)serializing values */
  export type SerializePropertyArgument =
    | string
    | {
      serializedKey?: string;
      fromJsonStrategy?:
        | FromJsonStrategy
        | (FromJsonStrategy | FromJsonStrategy[])[];
      toJsonStrategy?:
        | ToJsonStrategy
        | (ToJsonStrategy | ToJsonStrategy[])[];
    };

  /** Property wrapper that adds serializable options to the class map
   * using the original propertyName as the map key
   */
  export function SerializeProperty(): PropertyDecorator;

  /** Property wrapper that adds serializable options to the class map
   * using the provided string as the map key
   */
  export function SerializeProperty(arg: string): PropertyDecorator;

  /** Property wrapper that adds serializable options to the class map
   * using options, `serializedName` as the key or `propertyName` if
   * `serializedName` is not set
   */
  export function SerializeProperty(
    arg: SerializePropertyArgument,
  ): PropertyDecorator;

  /** Function to build a `fromJsonStrategy` or `toJsonStrategy`.
   * Converts value from functions provided as parameters
   */
  export function composeStrategy(
    ...fns:
      | (FromJsonStrategy | FromJsonStrategy[])[]
      | (ToJsonStrategy | ToJsonStrategy[])[]
  ): FromJsonStrategy | ToJsonStrategy;

  /** revive data using `fromJson` on a subclass type */
  export function fromJsonAs<T>(
    type: T & { new (): Serializable },
  ): FromJsonStrategy;

  /** allows authors to pass a regex to parse as a date */
  export function createDateStrategy(regex: RegExp): FromJsonStrategy;

  /** Changed from
   * @see https://weblog.west-wind.com/posts/2014/Jan/06/JavaScript-JSON-Date-Parsing-and-real-Dates
   */
  export const ISODateFromJson: FromJsonStrategy;
}
