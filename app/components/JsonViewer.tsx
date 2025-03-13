import { useState } from 'react';
import { IconChevronRight, IconChevronDown } from '@tabler/icons-react';

// Define strict types for JSON values
type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonArray | JsonObject;

interface JsonViewerProps {
  data: JsonValue;
  level?: number;
  expanded?: boolean;
  isRoot?: boolean;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, level = 0, expanded = true, isRoot = true }) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const indent = level * 16;

  const getDataType = (value: JsonValue): string => {
    if (Array.isArray(value)) return 'array';
    if (value === null) return 'null';
    return typeof value;
  };

  const getTypeColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      string: 'text-green-600',
      number: 'text-blue-600',
      boolean: 'text-purple-600',
      null: 'text-red-500',
      undefined: 'text-gray-500',
      object: 'text-gray-900',
      array: 'text-gray-900',
    };
    return colors[type] || 'text-gray-900';
  };

  const formatValue = (value: JsonValue): string => {
    const type = getDataType(value);
    if (type === 'string') return `"${value}"`;
    if (type === 'null') return 'null';
    if (type === 'undefined') return 'undefined';
    return String(value);
  };

  const renderCollapsible = (
    label: string,
    value: JsonValue,
    isArray: boolean = false
  ) => {
    const isEmpty = isArray ? (value as JsonArray).length === 0 : Object.keys(value as JsonObject).length === 0;
    const bracketColor = 'text-gray-500';
    
    if (isEmpty) {
      return (
        <div style={{ marginLeft: `${indent}px` }} className="py-1">
          <span className="text-gray-700">{label}</span>
          <span className={`${bracketColor}`}>: </span>
          <span className={bracketColor}>
            {isArray ? '[]' : '{}'}
          </span>
        </div>
      );
    }

    return (
      <div style={{ marginLeft: `${indent}px` }}>
        <div
          className="flex items-center py-1 cursor-pointer select-none group"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="w-4 h-4 mr-1 flex items-center justify-center text-gray-400 group-hover:text-gray-600">
            {isExpanded ? (
              <IconChevronDown className="w-4 h-4" />
            ) : (
              <IconChevronRight className="w-4 h-4" />
            )}
          </span>
          <span className="text-gray-700">{label}</span>
          <span className={bracketColor}>: </span>
          <span className={bracketColor}>
            {isArray ? '[' : '{'}
          </span>
          {!isExpanded && (
            <>
              <span className="text-gray-400 ml-1">
                {isArray ? `${(value as JsonArray).length} items` : `${Object.keys(value as JsonObject).length} properties`}
              </span>
              <span className={bracketColor}>
                {isArray ? ']' : '}'}
              </span>
            </>
          )}
        </div>
        {isExpanded && (
          <div className="border-l border-gray-200 ml-2">
            {isArray
              ? (value as JsonArray).map((item: JsonValue, index: number) => (
                  <div key={index}>
                    {typeof item === 'object' && item !== null ? (
                      <JsonViewer
                        data={item}
                        level={level + 1}
                        expanded={true}
                        isRoot={false}
                      />
                    ) : (
                      <div
                        style={{ marginLeft: `${indent + 16}px` }}
                        className="py-1"
                      >
                        <span className={getTypeColor(getDataType(item))}>
                          {formatValue(item)}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              : Object.entries(value as JsonObject).map(([key, val]: [string, JsonValue]) => (
                  <div key={key}>
                    {typeof val === 'object' && val !== null ? (
                      <JsonViewer
                        data={{ [key]: val }}
                        level={level + 1}
                        expanded={true}
                        isRoot={false}
                      />
                    ) : (
                      <div
                        style={{ marginLeft: `${indent + 16}px` }}
                        className="py-1"
                      >
                        <span className="text-gray-700">{key}</span>
                        <span className={`${bracketColor}`}>: </span>
                        <span className={getTypeColor(getDataType(val))}>
                          {formatValue(val)}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
            <div style={{ marginLeft: `${indent}px` }} className={bracketColor}>
              {isArray ? ']' : '}'}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (typeof data !== 'object' || data === null) {
    return (
      <div style={{ marginLeft: `${indent}px` }} className="py-1">
        <span className={getTypeColor(getDataType(data))}>
          {formatValue(data)}
        </span>
      </div>
    );
  }

  const entries = Object.entries(data);
  if (entries.length === 0) {
    return (
      <div style={{ marginLeft: `${indent}px` }} className="py-1">
        <span className="text-gray-500">{Array.isArray(data) ? '[]' : '{}'}</span>
      </div>
    );
  }

  if (isRoot) {
    return (
      <div className="font-mono text-xs">
        <div className="text-gray-500">{'{'}</div>
        {entries.map(([key, value]) => (
          <div key={key}>
            {typeof value === 'object' && value !== null ? (
              renderCollapsible(key, value, Array.isArray(value))
            ) : (
              <div style={{ marginLeft: `${indent + 16}px` }} className="py-1">
                <span className="text-gray-700">{key}</span>
                <span className="text-gray-500">: </span>
                <span className={getTypeColor(getDataType(value))}>
                  {formatValue(value)}
                </span>
              </div>
            )}
          </div>
        ))}
        <div className="text-gray-500">{'}'}</div>
      </div>
    );
  }

  return (
    <>
      {entries.map(([key, value]) => (
        <div key={key}>
          {typeof value === 'object' && value !== null ? (
            renderCollapsible(key, value, Array.isArray(value))
          ) : (
            <div style={{ marginLeft: `${indent}px` }} className="py-1">
              <span className="text-gray-700">{key}</span>
              <span className="text-gray-500">: </span>
              <span className={getTypeColor(getDataType(value))}>
                {formatValue(value)}
              </span>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default JsonViewer;