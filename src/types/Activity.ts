declare namespace Activity {
  interface ActivityModel {
    /**
     * 活动官网页的背景图 不设置就是默认背景
     */
    activityBackgroundImg?: string;
    /**
     * 活动cm 视频链接 可以拥有好几个CM
     */
    activityCM?: string[];
    /**
     * 活动封面图
     */
    activityCover?: string;
    /**
     * 活动主id，活动的id 根据此id进行各种操作
     */
    activityId: number;
    /**
     * 活动专属logo
     */
    activityLogo?: string;
    activityName: I18N;
    /**
     * 创建时间 Date类型
     */
    createTime?: string;
    days?: number;
    /**
     * 富文本的多语言简介
     */
    desc?: I18N;
    endTime?: string;
    movieNums?: number;
    /**
     * 赞助商id  可以有多个赞助商
     */
    sponsorId?: number[];
    staff?: Staff;
    startTime?: string;
  }
}