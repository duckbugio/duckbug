type Primitive = string | number | boolean | null | undefined;
type ParamsRecord = Record<string, Primitive>;

export const buildSearchParams = (params: ParamsRecord): string => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === '') return;
        sp.set(key, String(value));
    });
    return sp.toString();
};
