// Converts the current state of a visual metaphor into real Python code.
// Each metaphor type has its own generator function.
// The output is displayed live in the Monaco editor as the kid interacts.

/**
 * Main entry point — dispatches to the correct generator.
 * @param {string} metaphorType - The type of visual metaphor
 * @param {object} state - The current interactive state from the metaphor component
 * @returns {string} Valid Python code string
 */
export const generateCode = (metaphorType, state) => {
  const generators = {
    variable:     generateVariable,
    string:       generateString,
    integer:      generateInteger,
    boolean:      generateBoolean,
    list:         generateList,
    loop:         generateLoop,
    conditional:  generateConditional,
    function:     generateFunction,
    parameter:    generateParameter,
    return_value: generateReturnValue,
    dictionary:   generateDictionary,
    class:        generateClass,
    object:       generateObject,
  };

  const generator = generators[metaphorType];
  if (!generator) return "# Select a value to generate code";

  return generator(state);
};

// ── Individual generators ─────────────────────────────────────────────────

const generateVariable = ({ name = "my_variable", value = "42", valueType = "integer" }) => {
  const formattedValue = valueType === "string" ? `"${value}"` : value;
  return `${name} = ${formattedValue}\nprint(${name})`;
};

const generateString = ({ name = "greeting", value = "Hello, world!" }) => {
  return `${name} = "${value}"\nprint(${name})`;
};

const generateInteger = ({ name = "score", value = "0" }) => {
  return `${name} = ${value}\nprint(${name})`;
};

const generateBoolean = ({ name = "is_ready", value = true }) => {
  return `${name} = ${value ? "True" : "False"}\nprint(${name})`;
};

const generateList = ({ name = "items", values = ["apple", "banana", "cherry"] }) => {
  const formatted = values.map((v) => `"${v}"`).join(", ");
  return `${name} = [${formatted}]\nprint(${name})\nprint(len(${name}))`;
};

const generateLoop = ({ variable = "i", count = 3, action = "print" }) => {
  return `for ${variable} in range(${count}):\n    ${action}(${variable})`;
};

const generateConditional = ({ variable = "score", operator = ">=", threshold = "50", trueAction = 'print("Pass!")', falseAction = 'print("Try again!")' }) => {
  return `score = ${variable === "score" ? threshold : "0"}\nif ${variable} ${operator} ${threshold}:\n    ${trueAction}\nelse:\n    ${falseAction}`;
};

const generateFunction = ({ name = "greet", paramName = "name", body = 'print("Hello, " + name)' }) => {
  return `def ${name}(${paramName}):\n    ${body}\n\n${name}("World")`;
};

const generateParameter = ({ funcName = "add", param1 = "a", param2 = "b", operation = "+" }) => {
  return `def ${funcName}(${param1}, ${param2}):\n    result = ${param1} ${operation} ${param2}\n    print(result)\n\n${funcName}(3, 4)`;
};

const generateReturnValue = ({ funcName = "multiply", param1 = "x", param2 = "y" }) => {
  return `def ${funcName}(${param1}, ${param2}):\n    return ${param1} * ${param2}\n\nresult = ${funcName}(5, 6)\nprint(result)`;
};

const generateDictionary = ({ name = "person", keys = ["name", "age"], values = ["Alex", "10"] }) => {
  const pairs = keys.map((k, i) => `    "${k}": "${values[i] || ""}"`).join(",\n");
  return `${name} = {\n${pairs}\n}\nprint(${name})\nprint(${name}["${keys[0]}"])`;
};

const generateClass = ({ className = "Animal", attribute1 = "name", attribute2 = "sound" }) => {
  return `class ${className}:\n    def __init__(self, ${attribute1}, ${attribute2}):\n        self.${attribute1} = ${attribute1}\n        self.${attribute2} = ${attribute2}\n\n    def speak(self):\n        print(self.${attribute1} + " says " + self.${attribute2})`;
};

const generateObject = ({ className = "Animal", instanceName = "dog", arg1 = "Rex", arg2 = "Woof" }) => {
  return `class ${className}:\n    def __init__(self, name, sound):\n        self.name = name\n        self.sound = sound\n\n    def speak(self):\n        print(self.name + " says " + self.sound)\n\n${instanceName} = ${className}("${arg1}", "${arg2}")\n${instanceName}.speak()`;
};