import { Input, Component } from '@angular/core';
import { XInputNumber, XProperty, XInputBoolean, XNumber, XBoolean, XWithConfig } from '@ng-nest/ui/core';

/**
 * Progress
 * @selector x-progress
 * @decorator component
 */
export const XProgressPrefix = 'x-progress';
const X_CONFIG_NAME = 'progress';

/**
 * Progress Property
 */
@Component({ template: '' })
export class XProgressProperty extends XProperty {
  /**
   * @zh_CN 显示进度 0-100
   * @en_US Show progress 0-100
   */
  @Input() @XInputNumber() percent: XNumber = 0;
  /**
   * @zh_CN 进度条高度
   * @en_US Height of progress bar
   */
  @Input() @XWithConfig<string>(X_CONFIG_NAME, '0.5rem') height: string;
  /**
   * @zh_CN 状态
   * @en_US Status
   */
  @Input() status: XProgressStatus = 'normal';
  /**
   * @zh_CN 是否显示百分比文本
   * @en_US Whether to display percentage text
   */
  @Input() @XInputBoolean() info: XBoolean = true;
  /**
   * @zh_CN 百分比文本是否显示在进度条里面
   * @en_US Whether the percentage text is displayed in the progress bar
   */
  @Input() @XInputBoolean() inside: XBoolean;
  /**
   * @zh_CN 自定义百分比文本内容
   * @en_US Custom percentage text content
   */
  @Input() format?: Function;
  /**
   * @zh_CN 自定义颜色
   * @en_US Custom color
   */
  @Input() color?: string | { color: string; percent: number }[] | Function;
}

/**
 * @zh_CN 进度条类型
 * @en_US Progress bar type
 */
export type XProgressType = 'line' | 'circle' | 'dashboard';

/**
 * @zh_CN 状态
 * @en_US Status
 */
export type XProgressStatus = 'normal' | 'active' | 'success' | 'exception' | 'warning';
