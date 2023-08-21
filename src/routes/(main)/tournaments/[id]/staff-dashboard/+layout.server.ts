import { error } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";

export const load: LayoutServerLoad = async ({ parent }) => {
    const { tournament, editPerms, user } = await parent();

    if (!editPerms) {
        throw error(StatusCodes.UNAUTHORIZED, 'You do not have permission to access this page.');
    }

    return { tournament, user };
}