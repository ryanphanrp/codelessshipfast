import { useState, useEffect } from "react";

type FormatRules = {
  [key: string]: (param: string) => string;
};

const defaultRules: FormatRules = {
  null: () => "NULL",
  true: () => "1",
  false: () => "0",
  default: (param: string) => `'${param}'`,
};

// Regular expressions for different date-time formats
const timestampRegexes = {
  fullTimestamp: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,
  isoDateTime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?$/
};

function formatDateTime(dateTimeStr: string): string {
  let date: Date;

  try {
    // Parse the date string
    date = new Date(dateTimeStr);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateTimeStr;
    }

    // Format to YYYY-MM-DD HH:MM:SS
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    return dateTimeStr;
  }
}

function formatParam(param: string, customRules: FormatRules = {}) {
  const rules = { ...defaultRules, ...customRules };

  if (param === "null") return rules.null(param);
  if (param === "true") return rules.true(param);
  if (param === "false") return rules.false(param);

  // Check for timestamp formats
  if (timestampRegexes.fullTimestamp.test(param)) {
    return `TIMESTAMP '${param}'`;
  }

  if (timestampRegexes.isoDateTime.test(param)) {
    const formattedDate = formatDateTime(param);
    return `TIMESTAMP '${formattedDate}'`;
  }

  return customRules[param] ? customRules[param](param) : rules.default(param);
}

export function extractBindings(log: string): string[] {
  if (!log) return [];

  const regex = /binding parameter \[(\d+)\] as \[\w+\] - \[(.*?)\]/g;
  const bindings: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(log)) !== null) {
    const value = match[2];
    bindings[Number(match[1]) - 1] = value;
  }

  return bindings;
}

export function replaceQueryParams(query: string, params: string[], customRules?: FormatRules): string {
  if (!query) return '';

  let index = 0;
  return query.replace(/\?/g, () => {
    const value = params[index++];
    return formatParam(value, customRules);
  });
}

export function useFormattedSQL(
  sqlQuery: string,
  logHibernate: string,
  customRules?: FormatRules
): string {
  const [formattedSQL, setFormattedSQL] = useState<string>("");

  useEffect(() => {
    if (sqlQuery && logHibernate) {
      try {
        const bindings = extractBindings(logHibernate);
        const result = replaceQueryParams(sqlQuery, bindings, customRules);
        setFormattedSQL(result);
      } catch (error) {
        console.error('Error formatting SQL:', error);
        setFormattedSQL("");
      }
    } else {
      setFormattedSQL("");
    }
  }, [sqlQuery, logHibernate, customRules]);

  return formattedSQL;
}
