import { StatisticsModel, StatisticsParams } from 'Statistics'

export class AuthorModelEntity implements StatisticsModel {
  _id: string = ''
  _v: number = 0
  authorName: string | null = null
  authorAvatar: string | null = null
  participateTimes: string | number | null = 0
  consecutiveParticipateTimes: string | number | null = 0
  authorType: 'gold' | 'silver' | 'bronze' | 'normal' | 'platinum' | null = 'normal'
  participateMacthes: string[] | number[] | null = []
  createTime: string | Number | null = null
}

export class AuthorParamsEntity implements StatisticsParams {
  authorName: string | null = null
  authorAvatar: string | null = null
  participateTimes: string | number | null = 0
  consecutiveParticipateTimes: string | number | null = 0
  authorType: 'gold' | 'silver' | 'bronze' | 'normal' | 'platinum' | null = 'normal'
  participateMacthes: string[] | number[] | null = []
  createTime: string | Number | null = null
}
