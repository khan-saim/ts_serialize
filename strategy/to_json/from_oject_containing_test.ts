// Copyright 2018-2020 Gamebridge.ai authors. All rights reserved. MIT license.

import { assert, assertEquals, test } from "../../test_deps.ts";
import { fromObjectContaining } from "./from_object_containing.ts";
import { Serializable } from "../../serializable.ts";
import { SerializeProperty } from "../../serialize_property.ts";

test({
  name: "fromObjectContaining builds from Serializable",
  fn() {
    class SomeClass extends Serializable {
      @SerializeProperty()
      someClassProp = "test";
    }

    class Test extends Serializable {
      @SerializeProperty({ toJSONStrategy: fromObjectContaining })
      test: { [k: string]: SomeClass } = { testing: new SomeClass() };
    }

    assertEquals(
      new Test().toJSON(),
      `{"test":{"testing":{"someClassProp":"test"}}}`,
    );
  },
});

test({
  name: "fromObjectContaining uses right keys",
  fn() {
    class SomeClass extends Serializable {
      @SerializeProperty("some_class_prop")
      someClassProp = "test";
    }

    class Test extends Serializable {
      @SerializeProperty({ toJSONStrategy: fromObjectContaining })
      test: { [_: string]: SomeClass } = { testing: new SomeClass() };
    }

    assertEquals(
      new Test().toJSON(),
      `{"test":{"testing":{"some_class_prop":"test"}}}`,
    );
  },
});

test({
  name: "fromObjectContaining works with array sub-values",
  fn() {
    class SomeClass extends Serializable {
      @SerializeProperty()
      someClassProp = "test";
    }

    class Test extends Serializable {
      @SerializeProperty({ toJSONStrategy: fromObjectContaining })
      test: { [k: string]: SomeClass[] } = {
        testing: [new SomeClass(), new SomeClass(), new SomeClass()],
      };
    }

    assertEquals(
      new Test().toJSON(),
      `{"test":{"testing":[{"someClassProp":"test"},{"someClassProp":"test"},{"someClassProp":"test"}]}}`,
    );
  },
});
