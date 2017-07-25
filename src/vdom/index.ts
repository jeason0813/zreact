import { VNode } from "../vnode";
import { Component } from "../component";
import { isTextNode } from "../dom/index";
import { ATTR_KEY } from "../constants";
import { extend } from "../util";
import { IKeyValue } from "../types";

/**
 * dom节点与vnode是否相同的标签
 * @param node
 * @param vnode
 * @param hydrating
 */
export function isSameNodeType(node: any, vnode: VNode, hydrating: boolean) {
    if (typeof vnode === "string" || typeof vnode === "number") {
        // vnode是文本节点,判断dom是否为文本节点
        return isTextNode(node.base);
    }
    if (typeof vnode.nodeName === "string") {
        // vnode是原生组件,判断dom非组件的根节点且标签名相同
        return !node._componentConstructor && isNamedNode(node.base, vnode.nodeName);
    }
    return hydrating || node._componentConstructor === vnode.nodeName;
}

/** 判断标签名是否相同.
 * @param {Element} node
 * @param {String} nodeName
 */
export function isNamedNode(
    node: { normalizedNodeName: string, nodeName: string },
    nodeName: string,
) {
    return node.normalizedNodeName === nodeName
        || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * 获取当前组件所有地方来的props
 * @param vnode
 */
export function getNodeProps(vnode: VNode) {
    // jsx上的属性
    const props = extend({}, vnode.attributes);
    props.children = vnode.children;
    // 组件类
    const nodeName: any = vnode.nodeName;
    // 组件默认props
    const defaultProps = nodeName.defaultProps;
    if (defaultProps !== undefined) {
        for (const i in defaultProps) {
            if (props[i] === undefined) {
                props[i] = defaultProps[i];
            }
        }
    }
    return props;
}

interface IEventFun {
    [name: string]: (e: Event) => void;
}

/**
 * 真正dom绑定的一些数据
 * @constructor
 */
export class VDom {
    /**
     * dom所属的顶级Component
     */
    public component?: Component;
    /**
     * 子组件
     */
    public children?: VDom[];
    /**
     * 真实dom索引
     */
    public base?: Element;
    /**
     * 每种事件的代理方法存放点, 真实绑定到dom上的方法。
     */
    public eventProxy?: { [name: string]: (e: Event) => void };
    /**
     * dom所属的props
     */
    public props?: IKeyValue;
    /**
     * 通过props设置的事件方法, 通过eventProxy来调用, 保证在不停的props变化时不会一直绑定与解绑。
     */
    public listeners?: IEventFun;
    /**
     * dom标签名
     */
    public normalizedNodeName?: string;
}
