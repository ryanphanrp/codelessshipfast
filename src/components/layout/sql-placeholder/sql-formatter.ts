type FormatRules = {
  [key: string]: (param: string) => string;
};

const defaultRules: FormatRules = {
  null: () => "NULL",
  true: () => "1",
  false: () => "0",
  default: (param: string) => `'${param}'`,
};

// Regular expression for matching YYYY-MM-DD HH:mm:ss format
const timestampRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;

export const formatParam = (param: string, customRules: FormatRules = {}) => {
  const rules = { ...defaultRules, ...customRules };

  if (param === "null") return rules.null(param);
  if (param === "true") return rules.true(param);
  if (param === "false") return rules.false(param);

  // Check if the parameter matches timestamp format
  if (timestampRegex.test(param)) {
    return `TIMESTAMP '${param}'`;
  }

  return customRules[param] ? customRules[param](param) : rules.default(param);
};
