import { fail } from "@sveltejs/kit";
import type { LayoutServerData } from "./$types";
import { StatusCodes } from "$lib/StatusCodes";

export const load: LayoutServerData = async ({ parent }) => {
    const { tournament, editPerms, user } = await parent();

    if (!editPerms) {
        // TODO: fail is always returning a 500?
        throw fail(StatusCodes.UNAUTHORIZED, { message: "You do not have permission to access this page."})
    }

    return { tournament, user };
}