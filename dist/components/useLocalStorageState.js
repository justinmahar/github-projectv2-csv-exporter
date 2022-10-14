"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLocalStorageState = void 0;
const react_1 = __importDefault(require("react"));
const events_1 = __importDefault(require("events"));
const eventEmitter = new events_1.default();
const useLocalStorageState = (initial, key) => {
    var _a;
    const [state, setState] = react_1.default.useState(typeof localStorage !== 'undefined' ? (_a = localStorage[key]) !== null && _a !== void 0 ? _a : initial : initial);
    // Sync with all hook instances through an emitter
    react_1.default.useEffect(() => {
        const listener = (changedKey) => {
            var _a;
            if (key === changedKey) {
                setState(typeof localStorage !== 'undefined' ? (_a = localStorage[key]) !== null && _a !== void 0 ? _a : initial : initial);
            }
        };
        eventEmitter.addListener('change', listener);
        return () => eventEmitter.removeListener('change', listener);
    }, [initial, key]);
    const setStateCombined = (value) => {
        setState(value);
        localStorage[key] = value;
        eventEmitter.emit('change', key);
    };
    return [state, setStateCombined];
};
exports.useLocalStorageState = useLocalStorageState;
