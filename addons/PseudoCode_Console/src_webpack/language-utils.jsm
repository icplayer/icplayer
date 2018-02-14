export const TYPES = {
    EXECUTE: 1,
    JUMP: 2
};

export function generateExecuteObject (code, label, isAsync) {
    return {
        code: code,
        type: TYPES.EXECUTE,
        label: label,
        isAsync: isAsync || false
    };
}

export function generateJumpInstruction (code, toLabel) {
    return {
        code: code,
        toLabel: toLabel,
        type: TYPES.JUMP
    };
}