import type { Lesson } from '../schema/lesson'
import { agniAma } from './agni-ama'
import { dinacharyaLesson } from './dinacharya'
import { fiveElements } from './five-elements'
import { prakritiVikritiLesson } from './prakriti-vikriti'
import { ritucharyaLesson } from './ritucharya'
import { sevenDhatus } from './seven-dhatus'
import { sixTastes } from './six-tastes'
import { srotasLesson } from './srotas'
import { threeDoshas } from './three-doshas'
import { twentyGunas } from './twenty-gunas'
import { whatAyurvedaIs } from './what-ayurveda-is'

export const lessons: Lesson[] = [
  whatAyurvedaIs,
  fiveElements,
  threeDoshas,
  twentyGunas,
  sixTastes,
  agniAma,
  sevenDhatus,
  srotasLesson,
  dinacharyaLesson,
  ritucharyaLesson,
  prakritiVikritiLesson,
]
