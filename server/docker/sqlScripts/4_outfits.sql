-- Table: public.outfits
-- DROP TABLE public.outfits;
CREATE TABLE public.outfits
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    tagging_id uuid NOT NULL,
    top  character varying default NULL,
    bottom character varying default NULL,
    shoes character varying default NULL,
    jacket character varying default NULL,
    deleted boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT outfits_pkey PRIMARY KEY (id)
    )
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.outfits
    OWNER to postgres;

CREATE INDEX index_outfits_on_tagging_id
    ON public.outfits USING btree
    (tagging_id)
    TABLESPACE pg_default;
