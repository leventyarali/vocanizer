type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  userId?: string;
  path?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs: number = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private addLog(level: LogLevel, message: string, data?: any) {
    const logEntry: LogEntry = {
      timestamp: this.formatDate(new Date()),
      level,
      message,
      data,
      path: typeof window !== "undefined" ? window.location.pathname : undefined,
    };

    // Konsola yazdır
    const logStyle = {
      info: "color: #0ea5e9",
      warn: "color: #f59e0b",
      error: "color: #ef4444",
      debug: "color: #8b5cf6",
    };

    console.log(
      `%c[${logEntry.level.toUpperCase()}] ${logEntry.timestamp}`,
      logStyle[level],
      "\n",
      message,
      data ? "\nData:" : "",
      data || ""
    );

    // Log'u sakla
    this.logs.unshift(logEntry);

    // Maksimum log sayısını kontrol et
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }
  }

  info(message: string, data?: any) {
    this.addLog("info", message, data);
  }

  warn(message: string, data?: any) {
    this.addLog("warn", message, data);
  }

  error(message: string, data?: any) {
    this.addLog("error", message, data);
  }

  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === "development") {
      this.addLog("debug", message, data);
    }
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 