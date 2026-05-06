import { faker } from '@faker-js/faker'
import { LOG_TOPICS, type LogEntry, type LogTopic } from './schema'

faker.seed(600)

const TOPIC_TEMPLATES: Record<LogTopic, string[]> = {
  hotspot: [
    '-> :{mac}: trying to log in by {auth}',
    '-> :{mac}: logged in',
    '-> :{mac}: logged out: {reason}',
    '-> :{user}: ({ip}): trying to log in',
    '-> :{user}: ({ip}): logged in',
    '-> :{user}: ({ip}): session timeout',
  ],
  info: [
    'system started',
    'router rebooted',
    'package updated',
    'user {user} logged in via webfig',
    'configuration changed by {user}',
  ],
  debug: [
    'pool: assigned {ip} to {mac}',
    'queue tree updated',
    'dns cache flushed',
    'arp entry added: {mac} -> {ip}',
  ],
  warning: [
    'cpu load > 80%',
    'memory usage high: {mem}%',
    'temperature {temp}°C',
    'license expires in {days} days',
  ],
  error: [
    'failed to bind socket on {ip}',
    'authentication failed for {user}',
    'connection refused from {ip}',
    'pppoe-out1 disconnected',
  ],
  system: [
    'config saved',
    'backup created',
    'admin logged in from {ip}',
    'admin logged out',
    'firmware upgrade pending',
  ],
  firewall: [
    'input drop: {ip} -> {ip2} proto tcp',
    'forward accept: {ip}',
    'masquerade rule applied',
    'connection tracking limit',
  ],
  wireless: [
    'station {mac} associated',
    'station {mac} disassociated',
    'wmm settings applied',
    'channel changed to {chan}',
  ],
  dhcp: [
    'lease added: {mac} -> {ip}',
    'lease released: {mac}',
    'discover from {mac}',
    'offering {ip} to {mac}',
  ],
  pppoe: [
    'session opened for {user}',
    'session closed for {user}',
    'authentication ok',
    'lcp echo timeout',
  ],
}

const AUTH_METHODS = ['http-chap', 'http-pap', 'mac', 'cookie', 'trial']
const REASONS = ['user-request', 'idle-timeout', 'session-timeout', 'limits']

function randomMac(): string {
  return Array.from({ length: 6 }, () =>
    faker.number.int({ min: 0, max: 255 }).toString(16).padStart(2, '0')
  ).join(':')
}

function fillTemplate(tpl: string): string {
  return tpl
    .replace('{mac}', randomMac())
    .replace('{ip}', faker.internet.ipv4())
    .replace('{ip2}', faker.internet.ipv4())
    .replace('{user}', faker.internet.username().toLowerCase())
    .replace('{auth}', faker.helpers.arrayElement(AUTH_METHODS))
    .replace('{reason}', faker.helpers.arrayElement(REASONS))
    .replace('{mem}', faker.number.int({ min: 60, max: 95 }).toString())
    .replace('{temp}', faker.number.int({ min: 35, max: 65 }).toString())
    .replace('{days}', faker.number.int({ min: 1, max: 30 }).toString())
    .replace('{chan}', faker.number.int({ min: 1, max: 11 }).toString())
}

let idCounter = 0

function nextId(): string {
  idCounter += 1
  return `log-${idCounter.toString(36)}`
}

export function makeLogEntry(at: Date = new Date()): LogEntry {
  const topic = faker.helpers.arrayElement(LOG_TOPICS as readonly LogTopic[])
  const tpl = faker.helpers.arrayElement(TOPIC_TEMPLATES[topic])
  const message = fillTemplate(tpl)
  // primary topic + sometimes a secondary
  const topics: string[] =
    Math.random() < 0.3
      ? [topic, faker.helpers.arrayElement(['info', 'debug'])]
      : [topic]
  return {
    id: nextId(),
    time: at,
    topics,
    message,
  }
}

function buildSeed(count: number): LogEntry[] {
  const result: LogEntry[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const t = now - i * faker.number.int({ min: 2_000, max: 30_000 })
    result.push(makeLogEntry(new Date(t)))
  }
  return result
}

export const logEntriesSeed: LogEntry[] = buildSeed(300)

export const LOG_MAX_ENTRIES = 500
export const LOG_STREAM_INTERVAL_MS = 4000

export const TOPIC_COLORS: Record<string, string> = {
  hotspot: 'bg-sky-500/10 text-sky-700 dark:text-sky-400',
  info: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  debug: 'bg-muted text-muted-foreground',
  warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  error: 'bg-red-500/10 text-red-700 dark:text-red-400',
  system: 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
  firewall: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
  wireless: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  dhcp: 'bg-teal-500/10 text-teal-700 dark:text-teal-400',
  pppoe: 'bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400',
}

export function topicColor(topic: string): string {
  return TOPIC_COLORS[topic] ?? 'bg-muted text-muted-foreground'
}

export function filterLogs(
  entries: LogEntry[],
  search: string,
  selectedTopics: string[]
): LogEntry[] {
  const term = search.trim().toLowerCase()
  return entries.filter((e) => {
    if (
      selectedTopics.length > 0 &&
      !e.topics.some((t) => selectedTopics.includes(t))
    ) {
      return false
    }
    if (term && !e.message.toLowerCase().includes(term)) return false
    return true
  })
}
