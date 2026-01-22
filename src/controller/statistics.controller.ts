import { MemberVo } from 'Member'
import { StatisticsParams, StatisticsUpdateParams } from 'Statistics'
import { Auth } from '~/common/decorator/auth'
import { Controller, PostMapping, Body, User, Autowired, DeleteMapping, Param } from '~/common/decorator/decorator'
import Result from '~/common/result'
import { addNewAuthorParamsValidate, updateAuthorParamsValidate } from '~/common/validate/validate'
import { Validtor } from '~/middleware/ajv.middleware'
import StatisticsService from '~/service/statistics.service'
import { RESULT_CODE, RESULT_MSG } from '~/types/enum'

@Controller('/statistics')
export default class StatisticsController {
  @Autowired()
  statisticsService!: StatisticsService

  @PostMapping('/getAuthorRank')
  async getAuthorRank(@Body() pageParams: PageParams) {
    const res = await this.statisticsService.findAuthorList(pageParams)
    if (res) return Result.success(res)
    return Result.paramsError()
  }

  @PostMapping('/addNewAuthor', [Validtor('body', addNewAuthorParamsValidate)])
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/addNewAuthor')
  async addNewAuthor(@Body() authorParams: StatisticsParams, @User() userInfo: MemberVo) {
    if (!userInfo || !userInfo.memberId) {
      return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
    }

    const res = await this.statisticsService.saveAuthor(authorParams)
    return Result.success(res)
  }

  @PostMapping('/updateAuthor', [Validtor('body', updateAuthorParamsValidate)])
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateAuthor')
  async updateAuthor(@Body() authorParams: StatisticsUpdateParams, @User() userInfo: MemberVo) {
    if (!userInfo || !userInfo.memberId) {
      return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
    }

    const res = await this.statisticsService.updateAuthorInfo(authorParams)
    return Result.success(res)
  }

  @DeleteMapping('/deleteAuthor/:id')
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN, ROLE.COMMITTER, ROLE.GROUPMEMBER], '/updateAuthor')
  async deleteAuthorInfo(@Param('id') id: string) {
    const res = await this.statisticsService.deleteAuthor(id)
    return Result.success(res)
  }
}
