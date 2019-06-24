# Deno 风格指南


## 使用 TypeScript

## 使用术语 “module” 代替 “library” 或 “package”

为了清楚和一致，请避免使用术语 “library” 和 “package”。而是使用 “module” 来引用单个JS或TS文件，并且还引用TS / JS代码的目录。

## 不要使用`index.ts`或`index.js`这样的文件名

Deno不会以特殊方式处理“index.js”或“index.ts”。通过使用这些文件名，它表明当它们不能时，它们可以被排除在模块说明符之外。这令人困惑。

如果代码目录需要默认入口点，请使用文件名`mod.ts`。文件名`mod.ts`遵循Rust的约定，比简短index.ts，并且没有关于它如何工作的任何先入为主的概念。

## 在`deno_std`中，不要依赖外部代码

`deno_std`旨在成为所有Deno程序可以依赖的基准功能。我们希望向用户保证此代码不包含可能未经审核的第三方代码。

## 在`deno_std`中，最小化依赖关系，不要进行循环导入

虽然`deno_std`是一个独立的代码库，但我们仍然必须小心保持内部依赖关系的简单性和可管理性。特别要注意不要引入循环导入。

## 为保持一致性，请使用下划线，而不是文件名中的破折号

Example: 使用 `file_server.ts` 而不是 `file-server.ts`

## 使用更漂亮的格式代码

更具体地说，代码应该包含在80列并使用2空格缩进和驼峰式。使用`//format.ts`调用漂亮。

## 导出的函数：最多2个参数，将其余部分放入 options 对象中

设计函数接口时，请遵守以下规则

1.作为公共API一部分的函数需要0-2个必需参数，加上（如果需要）一个选项对象（总共最多3个）。

2.可选参数通常应该放入options对象。

如果只有一个可选参数，并且以后不会添加更多可选参数，那么不在options对象中的可选参数设计是可以接受的。

3.'options'参数是唯一的常规'Object'参数。
其他参数可以是对象，但它们必须与“普通”对象运行时区分开来，方法是：
  - 一个显着的原型 (e.g. `Array`, `Map`, `Date`, `class MyThing`)
  - 一个众所周知的符号属性 (e.g. 可迭代的 `Symbol.iterator`).

```ts
// BAD: 可选参数不是options对象的一部分。(#2)
export function resolve(
  hostname: string,
  family?: "ipv4" | "ipv6",
  timeout?: number
): IPAddress[] {}

// GOOD.
export interface ResolveOptions {
  family?: "ipv4" | "ipv6";
  timeout?: number;
}
export function resolve(
  hostname: string,
  options: ResolveOptions = {}
): IPAddress[] {}
```

```ts
export interface Environment {
  [key: string]: string;
}

// BAD: `env`可以是常规Object，因此与options对象无法区分。(#3)
export function runShellWithEnv(cmdline: string, env: Environment): string {}

// GOOD.
export interface RunShellOptions {
  env: Environment;
}
export function runShellWithEnv(
  cmdline: string,
  options: RunShellOptions
): string {}
```

```ts
// BAD: 超过3个参数（＃1），多个可选参数（＃2）。
export function renameSync(
  oldname: string,
  newname: string,
  replaceExisting?: boolean,
  followLinks?: boolean
) {}

// GOOD.
interface RenameOptions {
  replaceExisting?: boolean;
  followLinks?: boolean;
}
export function renameSync(
  oldname: string,
  newname: string,
  options: RenameOptions = {}
) {}
```

```ts
// BAD: 太多参数。 (#1)
export function pwrite(
  fd: number,
  buffer: TypedArray,
  offset: number,
  length: number,
  position: number
) {}

// BETTER.
export interface PWrite {
  fd: number;
  buffer: TypedArray;
  offset: number;
  length: number;
  position: number;
}
export function pwrite(options: PWrite) {}
```

## TODO 注释

TODO注释应该在括号中包含问题或作者的github用户名。示例：

```ts
// TODO(ry) Add tests.
// TODO(#123) Support Windows.
```

## 版权声明

`deno_std`中的大多数文件都应具有以下版权声明：

```ts
// Copyright 2018-2019 the Deno authors. All rights reserved. MIT license.
```

如果代码来自其他地方，请确保该文件具有适当的版权声明。在`deno_std`中我们只允许使用MIT，BSD和Apache许可代码。

## 顶级函数不应使用箭头语法

顶级函数应使用`function`关键字。箭头语法应限于闭包。

Bad

```ts
export const foo(): string => {
  return "bar";
}
```

Good

```ts
export function foo(): string {
  return "bar";
}
```

## 不鼓励使用元编程。包括使用Proxy。

即使它意味着更多的代码，也要明确。

在某些情况下，使用这些技术可能是有意义的，但在绝大多数情况下它不会。

## 如果文件名以下划线开头，请不要链接到它：`_foo.ts`

有时可能存在需要内部模块但其API不是稳定或链接的情况。在这种情况下，用下划线作为前缀。按照惯例，只有自己目录中的文件才能导入它。

## 使用JSDoc来记录导出的机器

我们力求完整的文档。理想情况下，每个导出的符号都应该有文档行。

如果可能，请为JSDoc使用单行。Example:

```ts
/** foo does bar. */
export function foo() {
  // ...
}
```

重要的是文档很容易被人类阅读，但也有一个需要提供额外的样式信息以确保生成的文档是更丰富的文字。因此，JSDoc通常应遵循markdown标记来丰富文字。

虽然markdown支持HTML标记，但在JSDoc块中禁止使用。

代码字符串文字应使用反引号（\`）而不是引号括起来。示例：

```ts
/** Import something from the `deno` module. */
```

不要记录函数参数，除非它们的意图不明显（尽管如果它们是非显而易见的意图，则应该考虑API）。因此，通常不应使用`@param`。如果使用`@param`，它应该不包括`type`，因为TypeScript已经是强类型的。

```ts
/**
 * Function with non obvious param
 * @param foo Description of non obvious parameter
 */
```

应尽可能减小垂直间距。因此单行评论应写为：

```ts
/** This is a good single line JSDoc */
```

而不是

```ts
/**
 * This is a bad single line JSDoc
 */
```

代码示例不应使用三反引号（\`\`\`）表示法或标记。它们应该只用缩进标记，这需要在块之前中断，并为示例的每一行添加6个额外的空格。这比注释的第一列多4个。例如：

```ts
/** A straight forward comment and an example:
 *
 *       import { foo } from "deno";
 *       foo("bar");
 */
```

代码示例不应包含其他注释，它已经在一个注释里了。如果它需要进一步的注释，那将不是一个好的示例。

## 每个模块都应该有测试

每个模块的测试文件应该按照`modulename_test.ts`规则来命名。例如，模块`foo.ts`的测试文件命名应该是`foo_test.ts`。

## 单元测试应该是明确的

为了更好地理解测试，应在整个测试命令中正确命名函数。比如：

```
test myTestFunction ... ok
```

测试示例：

```ts
import { assertEquals } from "https://deno.land/std@v0.5/testing/asserts.ts";
import { test } from "https://deno.land/std@v0.5/testing/mod.ts";
import { foo } from "./mod.ts";

test(function myTestFunction() {
  assertEquals(foo(), { bar: "bar" });
});
```
