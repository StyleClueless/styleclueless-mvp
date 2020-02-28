-- Table: public.tagging

-- DROP TABLE public.tagging;
CREATE TABLE public.tagging
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    company_id uuid NOT NULL,
    code  character varying default NULL,
    demography  character varying default NULL,
    class  character varying default NULL,
    design  character varying default NULL,
    shade  character varying default NULL,
    style  character varying default NULL,
    deleted boolean DEFAULT false,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    CONSTRAINT tagging_pkey PRIMARY KEY (company_id,code),
    CONSTRAINT tagging_card_id_fkey FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.tagging
    OWNER to postgres;

-- Index: index_tagging_on_client_id

-- DROP INDEX public.index_tagging_on_client_id;

CREATE INDEX index_tagging_on_code
    ON public.tagging USING btree
    (code)
    TABLESPACE pg_default;
