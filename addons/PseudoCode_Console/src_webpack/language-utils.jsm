export const TYPES = {
    EXECUTE: 1,
    JUMP: 2
};

/**
 * Generate code executed by addon.
 * @param  {String} code
 * @param  {String} label set label for goto instruction
 * @param  {Boolean} [isAsync] async instructions cant be merged and is optional
 */
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