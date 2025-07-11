import type { User, Rule } from '@/types';

function evaluateCondition(userValue: any, operator: Rule['operator'], ruleValue: any): boolean {
  // Handle date comparisons for 'lastSeen'
  if (userValue && operator !== 'contains' && operator !== 'not contains' && !isNaN(Date.parse(userValue)) && !isNaN(Date.parse(ruleValue))) {
    const userDate = new Date(userValue).getTime();
    const ruleDate = new Date(ruleValue).getTime();
    switch (operator) {
      case '>': return userDate > ruleDate;
      case '<': return userDate < ruleDate;
      case '=': return userDate === ruleDate;
      case '!=': return userDate !== ruleDate;
      default: return false;
    }
  }

  // Handle other types
  switch (operator) {
    case '>':
      return Number(userValue) > Number(ruleValue);
    case '<':
      return Number(userValue) < Number(ruleValue);
    case '=':
       // For boolean 'isPro', compare boolean values
      if (typeof userValue === 'boolean') {
        return userValue === (String(ruleValue).toLowerCase() === 'true');
      }
      // Loosely typed comparison for others
      // eslint-disable-next-line eqeqeq
      return userValue == ruleValue;
    case '!=':
      if (typeof userValue === 'boolean') {
        return userValue !== (String(ruleValue).toLowerCase() === 'true');
      }
      // eslint-disable-next-line eqeqeq
      return userValue != ruleValue;
    case 'contains':
      return typeof userValue === 'string' && userValue.toLowerCase().includes(String(ruleValue).toLowerCase());
    case 'not contains':
      return typeof userValue === 'string' && !userValue.toLowerCase().includes(String(ruleValue).toLowerCase());
    default:
      return false;
  }
}

export function filterUsersByRules(users: User[], rules: Rule[]): User[] {
  if (!rules || rules.length === 0) {
    return [];
  }

  return users.filter(user => {
    // A user must match ALL rules (AND logic)
    return rules.every(rule => {
      if (!rule.field || !rule.operator) return false;
      const userValue = user[rule.field];

      let parsedRuleValue = rule.value;
      
      // Determine the type of the user's property and parse rule value accordingly
      if (typeof userValue === 'number') {
        parsedRuleValue = Number(rule.value);
        if (isNaN(parsedRuleValue as number)) return false; // Don't match if value is not a number
      } else if (typeof userValue === 'boolean') {
         parsedRuleValue = String(rule.value).toLowerCase() === 'true';
      }

      return evaluateCondition(userValue, rule.operator, parsedRuleValue);
    });
  });
}
