import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

export const generateRandomName = () => uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] });