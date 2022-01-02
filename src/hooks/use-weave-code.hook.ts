import ky from "ky";
import { useMutation, useQuery } from "react-query";

const url =
  process.env.NODE_ENV === "production"
    ? "https://api.e8y.fun/weave"
    : "http://localhost:3001/";

export function useWeaveCode(code: string) {
  return useQuery(
    "weave-code",
    async () => {
      const res = await ky
        .get(url, {
          searchParams: { code },
        })
        .json<{ peerId: string }>();
      return res.peerId;
    },
    { enabled: !!code }
  );
}

export function useCreateWeaveCode() {
  return useMutation("weave-create", async (payload: unknown) => {
    const res = await ky
      .post(url, {
        json: { peerId: payload },
      })
      .json<{ code: string }>();
    return res.code;
  });
}
