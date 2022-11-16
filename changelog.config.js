module.exports = {
	disableEmoji: false,
	format: '{type}{scope}: {emoji} {subject}',
	list: ['test', 'feat', 'fix', 'config', 'docs', 'refactor', 'style', 'perf', 'add'],
	maxMessageLength: 64,
	minMessageLength: 3,
	questions: ['type', 'scope', 'subject', 'body', 'breaking', 'issues', 'lerna'],
	scopes: [],
	types: {
		config: {
			description: '配置修改',
			emoji: '🔧',
			value: 'config'
		},
		docs: {
			description: '文档更新',
			emoji: '✏️',
			value: 'docs'
		},
		feat: {
			description: '新功能',
			emoji: '🎉',
			value: 'feat'
		},
		add: {
			description: '增加新模块 新代码 各种其他',
			emoji: '⭐',
			value: 'add'
		},
		fix: {
			description: '修复bug',
			emoji: '🐛',
			value: 'fix'
		},
		perf: {
			description: '性能优化 ',
			emoji: '⚡️',
			value: 'perf'
		},
		refactor: {
			description: '重构代码或者改变代码结构',
			emoji: '💡',
			value: 'refactor'
		},
		release: {
			description: '发布版',
			emoji: '🏹',
			value: 'release'
		},
		style: {
			description: '代码规范 代码格式修改 ',
			emoji: '✨',
			value: 'style'
		},
		test: {
			description: '单元测试 ',
			emoji: '💍',
			value: 'test'
		},
		messages: {
			type: "Select the type of change that you're committing:",
			customScope: 'Select the scope this component affects:',
			subject: 'Write a short, imperative mood description of the change:\n',
			body: '提供一个长描述来说明你更改了什么:\n ',
			footer: '关联issue e.g #123:',
			confirmCommit: '是否有相关联的包会被影响\n'
		}
	}
}
