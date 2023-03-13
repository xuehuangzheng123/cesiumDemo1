import { defineConfig, presetAttributify, presetIcons, presetUno } from "unocss";

export default defineConfig({
	presets: [
		presetUno(),
		presetAttributify(),
		presetIcons({
			scale: 1.2,
			warn: true,
			extraProperties: {
				display: "inline-block",
				"vertical-align": "middle"
			}
		})
	],
	shortcuts: [
		["wh-full", "w-full h-full"],
		["f-b-c", "flex justify-between items-center"],
		["f-c-c", "flex justify-center items-center"],
		["f-e-c", "flex justify-evenly items-center"],
		["f-ic", "flex items-center"],
		["flex-col", "flex flex-col"],
		["text-ellipsis", "truncate"],
		[
			"icon-btn",
			"text-16 inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary !outline-none"
		]
	],
	rules: [
		[/^m-(\d+)$/, ([, d]) => ({ margin: `${d / 4}rem` })],
		[
			"p-c", // 使用时只需要写 p-c 即可应用该组样式
			{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: `translate(-50%, -50%)`
			}
		],
		[/^bc-(.+)$/, ([, color]) => ({ "border-color": `#${color}` })],
		[/^l-h-(.+)$/, ([, val]) => ({ "line-height": `${val}` })],
		["card-shadow", { "box-shadow": "0 1px 2px -2px #00000029, 0 3px 6px #0000001f, 0 5px 12px 4px #00000017" }],
		[/^bg-i-(.+)/, match => ({ "background-image": `url(${match[1]})` })]
	]
	// theme: {
	// 	colors: {
	// 		primary: "var(--primary-color)",
	// 		dark_bg: "var(--dark-bg)"
	// 	}
	// }
});
