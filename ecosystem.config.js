module.exports = {
	apps: {
		name: 'MMGC-backend-server2', // 项目名
		script: 'ts-node', // 执行文件
		cwd: '.', // 根目录
		node_args: '-r ts-node/register -r tsconfig-paths/register src/index.ts',
		interpreter: '', // 指定的脚本解释器
		interpreter_args: '', // 传递给解释器的参数
		watch: false, // 是否监听文件变动然后重启
		ignore_watch: ['node_modules', 'logs'],
		instance: 1,
		error_file: './logs/app-err.log', // 错误日志文件
		out_file: './logs/logs.log', // 正常日志文件
		merge_logs: true, // 设置追加日志而不是新建日志
		log_date_format: 'YYYY-MM-DD HH:mm:ss', // 指定日志文件的时间格式
		min_uptime: '60s', // 应用运行少于时间被认为是异常启动
		max_restarts: 30, // 最大异常重启次数，即小于min_uptime运行时间重启次数；
		autorestart: true, // 默认为true, 发生异常的情况下自动重启
		cron_restart: '', // crontab时间格式重启应用，目前只支持cluster模式;
		restart_delay: 60, // 异常重启情况下，延时重启时间
		env: {
			NODE_ENV: 'prod' // process.env.REMOTE_ADDR
		},
		env_dev: {
			NODE_ENV: 'dev'
		}
	}
}
