import { RESULT_CODE, RESULT_MSG } from '~/types/enum'
import Result from '~/common/result'
import {
  Autowired,
  Body,
  Controller,
  DeleteMapping,
  GetMapping,
  Param,
  PostMapping,
  PutMapping,
  QueryAll,
  User
} from '~/common/decorator/decorator'
import { aesDecrypt, copyProperties } from '~/common/utils'
import { Validtor } from '~/middleware/ajv.middleware'
import { memberParamsValidate, memberUpdateParamsValidate } from '~/common/validate/validate'
import { MemberModel, MemberParams, MemberVo } from 'Member'
import MemberService from '~/service/member.service'
import { MemberParamsEntity } from '~/entity/member.entity'
import { EmailUtil } from '~/common/utils/emailutil'
import { createJsonWebToken } from '~/common/utils/jwtutil'
import config from '~/config/config.default'
import crypto from 'node:crypto'
import { Auth } from '~/common/decorator/auth'

@Controller('/user')
export default class MemberController {
  @Autowired()
  memberService!: MemberService

  @Autowired()
  emailUtils!: EmailUtil

  @PostMapping('/register', [Validtor('body', memberParamsValidate)])
  async register(@Body() registerParams: MemberParams) {
    if (
      (await this.memberService.findMemberVoByEmail(registerParams.email)) ||
      (await this.memberService.findMemberVoByUsername(registerParams.username))
    ) {
      return Result.fail(RESULT_CODE.DATA_REPEAT, RESULT_MSG.DATA_REPEAT, null)
    }
    if (await this.emailUtils.verifyCode(registerParams.email, registerParams.verifyCode)) {
      const params = new MemberParamsEntity()
      copyProperties(registerParams, params)
      const member = await this.memberService.save(params)
      const token = createJsonWebToken(member, config.JWT_SECRET || 'jwt-token', 3600 * 48)
      return Result.success(token)
    } else {
      return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
    }
  }

  @PostMapping('/login')
  async login(@Body() loginParams: { username: string; password: string }) {
    const user = await this.memberService.findMemberByUsername(loginParams.username)
    if (!user) {
      return Result.fail(RESULT_CODE.USER_PASSWORD_WRONG, RESULT_MSG.USER_PASSWORD_WRONG, null)
    } else {
      const key = crypto.scryptSync(config.AES_PASSWORD || '', config.AES_SALT || '', 16)
      const decryptData = aesDecrypt(user.password, key)
      if (decryptData === loginParams.password) {
        const userVo = this.memberService.copyToVo(user, true)
        return Result.success(createJsonWebToken(userVo, config.JWT_SECRET || 'jwt-token', 3600 * 48))
      } else {
        return Result.fail(RESULT_CODE.USER_PASSWORD_WRONG, RESULT_MSG.USER_PASSWORD_WRONG, null)
      }
    }
  }

  @GetMapping('/getMyInfo')
  async getMyInfo(@User() user: MemberModel) {
    const realUser = await this.memberService.findMemberVoByMemberId(user.memberId, true)
    if (realUser) {
      return Result.success(realUser)
    } else {
      return Result.noAuth()
    }
  }

  /**
   * 这个为公用的函数 不涉及角色
   * @param pageParams 分页参数
   * @returns
   */
  @GetMapping('/getUserList')
  async getUserList(@QueryAll() pageParams: PageParams) {
    const res = await this.memberService.findMemberList(pageParams, false)
    return Result.success(res)
  }

  /**
   * 这个为全量获取 包括角色
   * @param pageParams 分页参数
   * @returns
   */
  @GetMapping('/getUserListAll')
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN], '/getUserListAll')
  async getUserListAll(@QueryAll() pageParams: PageParams) {
    const res = await this.memberService.findMemberList(pageParams, true)
    return Result.success(res)
  }

  @DeleteMapping('/batchDelete')
  @Auth([ROLE.ADMIN], '/batchDelete')
  async deleteUserBatch(@Body() memberIds: Array<number>, @User() userInfo: MemberVo) {
    if (memberIds.includes(userInfo.memberId)) {
      return Result.noPermission()
    }
    const res = await this.memberService.batchDelete(memberIds)
    return Result.success(res)
  }

  @PostMapping('/resetPassword')
  async resetPassword(@Body() memberParams: { email: string; password: string; code: number }) {
    if (!memberParams.email || !memberParams.password) {
      return Result.paramsError()
    }
    if (await this.emailUtils.verifyCode(memberParams.email, memberParams.code)) {
      const res = await this.memberService.resetPwd(memberParams)
      if (res) {
        return Result.success(createJsonWebToken(res, config.JWT_SECRET || 'jwt-token', 3600 * 48))
      } else {
        return Result.dataNotFound()
      }
    } else {
      return Result.fail(RESULT_CODE.VERIFY_ERROR, RESULT_MSG.VERIFY_ERROR, null)
    }
  }

  @PutMapping('/updateMember', [Validtor('body', memberUpdateParamsValidate)])
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN], '/updateMember')
  async updateUser(@Body() memberParams: MemberVo, @User() userInfo: MemberVo) {
    const { role } = memberParams
    if (role === ROLE.ADMIN && userInfo.role !== ROLE.ADMIN) {
      return Result.noAuth()
    }
    const res = await this.memberService.updateUser(memberParams)
    if (res) {
      return Result.success(res)
    } else {
      return Result.paramsError()
    }
  }

  @PostMapping('/updateUserInfoByToken', [Validtor('body', memberUpdateParamsValidate)])
  async updateUserInfoByToken(@Body() memberParams: MemberVo, @User() user: MemberVo) {
    if (!user || !user.memberId) return Result.noAuth()
    if (!memberParams.memberId) return Result.paramsError()
    if (user.memberId !== memberParams.memberId) {
      return Result.noAuth()
    }
    const res = await this.memberService.updateUser(memberParams)
    if (res) {
      return Result.success(res)
    } else {
      return Result.paramsError()
    }
  }

  // updateUserInfoByToken

  @PostMapping('/addMember')
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN], '/addMember')
  async addMember(@Body() memberParams: MemberVo) {
    if (await this.memberService.findMemberVoByUsername(memberParams.username)) {
      return Result.fail(RESULT_CODE.DATA_REPEAT, RESULT_MSG.DATA_REPEAT, null)
    }
    const res = await this.memberService.addMember(memberParams)
    if (res) {
      return Result.success(res)
    } else {
      return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
    }
  }

  @GetMapping('/getUserDetail/:memberId')
  @Auth([ROLE.ADMIN, ROLE.SUBADMIN], '/getUserDetail')
  async getUserDetail(@Param('memberId') memberId: number) {
    const res = await this.memberService.findMemberVoByMemberId(memberId, true)
    if (res) {
      return Result.success(res)
    } else {
      return Result.fail(RESULT_CODE.USER_NOTFOUND, RESULT_MSG.USER_NOTFOUND, null)
    }
  }
}
