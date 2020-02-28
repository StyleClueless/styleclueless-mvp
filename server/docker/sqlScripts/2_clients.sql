-- Table: public.clients

-- DROP TABLE public.clients;

CREATE TABLE public.clients
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    email character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default",
    salt character varying COLLATE pg_catalog."default",
    company_id uuid NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    deleted boolean DEFAULT false,
    CONSTRAINT clients_pkey PRIMARY KEY (id),
    CONSTRAINT "UNIQUE_client" UNIQUE (email)
,
    CONSTRAINT fk_clients_company_id FOREIGN KEY (company_id)
        REFERENCES public.companies (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.clients
    OWNER to postgres;
