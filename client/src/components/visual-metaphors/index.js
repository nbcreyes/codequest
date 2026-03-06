// Central registry — maps metaphor type strings to their components.
// Import from here everywhere so we never have to update multiple import sites.

export { default as VariableMetaphor }    from "./VariableMetaphor";
export { default as StringMetaphor }      from "./StringMetaphor";
export { default as IntegerMetaphor }     from "./IntegerMetaphor";
export { default as BooleanMetaphor }     from "./BooleanMetaphor";
export { default as ListMetaphor }        from "./ListMetaphor";
export { default as LoopMetaphor }        from "./LoopMetaphor";
export { default as ConditionalMetaphor } from "./ConditionalMetaphor";
export { default as FunctionMetaphor }    from "./FunctionMetaphor";
export { default as ParameterMetaphor }   from "./ParameterMetaphor";
export { default as ReturnValueMetaphor } from "./ReturnValueMetaphor";
export { default as DictionaryMetaphor }  from "./DictionaryMetaphor";
export { default as ClassMetaphor }       from "./ClassMetaphor";
export { default as ObjectMetaphor }      from "./ObjectMetaphor";

// Map type string to component for dynamic rendering
import VariableMetaphor    from "./VariableMetaphor";
import StringMetaphor      from "./StringMetaphor";
import IntegerMetaphor     from "./IntegerMetaphor";
import BooleanMetaphor     from "./BooleanMetaphor";
import ListMetaphor        from "./ListMetaphor";
import LoopMetaphor        from "./LoopMetaphor";
import ConditionalMetaphor from "./ConditionalMetaphor";
import FunctionMetaphor    from "./FunctionMetaphor";
import ParameterMetaphor   from "./ParameterMetaphor";
import ReturnValueMetaphor from "./ReturnValueMetaphor";
import DictionaryMetaphor  from "./DictionaryMetaphor";
import ClassMetaphor       from "./ClassMetaphor";
import ObjectMetaphor      from "./ObjectMetaphor";

export const METAPHOR_COMPONENTS = {
  variable:     VariableMetaphor,
  string:       StringMetaphor,
  integer:      IntegerMetaphor,
  boolean:      BooleanMetaphor,
  list:         ListMetaphor,
  loop:         LoopMetaphor,
  conditional:  ConditionalMetaphor,
  function:     FunctionMetaphor,
  parameter:    ParameterMetaphor,
  return_value: ReturnValueMetaphor,
  dictionary:   DictionaryMetaphor,
  class:        ClassMetaphor,
  object:       ObjectMetaphor,
};