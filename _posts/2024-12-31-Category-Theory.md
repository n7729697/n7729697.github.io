---
title: Category Theory for Programmers - From Composition to Monads
tags: [category theory, functional programming, monads, functors]
style: fill
color: light
description: A long-form guide based on the Uppsala University Category Theory for Programmers reading list, expanded into a continuous path from composition and types to Yoneda, adjunctions, and monads.
---

_This note is adapted from the public **Category Theory for Programmers** reading-group path at **Uppsala University** and Bartosz Milewski's public book materials. The source page is a reading-group sequence rather than a conventional course-code syllabus._

## Central Question

Category theory asks programmers: **what remains true when we stop staring at implementations and focus on lawful composition?**

A category consists of objects, arrows, identity arrows, and associative composition. In a programming interpretation, objects may be types and arrows may be functions:

```haskell
(.) :: (b -> c) -> (a -> b) -> a -> c
id  :: a -> a
```

The laws are the design point:

```haskell
h . (g . f) = (h . g) . f
id . f      = f
f . id      = f
```

These laws explain why composable interfaces scale. They let us refactor pipelines, move adapters, and reason about whole programs through smaller parts.

{% include figure.html image="/assets/img/posts/category-theory/composition-law-map.svg" alt="Category diagram showing objects, arrows, identity, and associative composition." caption="Category theory starts with one engineering demand: arrows should compose lawfully, with identity doing nothing." %}

## 1. Types, Effects, and Kleisli Composition

Ordinary functions compose cleanly:

```haskell
parseInt   :: String -> Int
increment  :: Int -> Int
renderText :: Int -> String
```

But real programs also fail, branch, log, read environments, and mutate state. A partial function such as `head :: [a] -> a` hides failure. A safer type exposes it:

```haskell
safeHead :: [a] -> Maybe a
```

Now ordinary composition is not enough because the output is wrapped in context. Kleisli composition gives a new category of effectful arrows:

```haskell
(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c
```

The lesson is powerful: effectful code is not failed pure code. It composes in a different category, provided the effect has the right laws.

## 2. Products, Coproducts, and Algebraic Data Types

Products represent "and". A pair contains both an `a` and a `b`:

```haskell
fst :: (a, b) -> a
snd :: (a, b) -> b
```

Coproducts represent "or":

```haskell
data Either a b = Left a | Right b
```

Algebraic data types combine products and coproducts:

```haskell
data Shape
  = Circle Double
  | Rectangle Double Double
```

Category theory describes these constructions through universal properties, not syntax. That matters because universal properties define what an interface must do, independent of representation.

{% include figure.html image="/assets/img/posts/category-theory/products-coproducts-adt.svg" alt="Diagram mapping products to records and coproducts to tagged alternatives in algebraic data types." caption="ADTs are built from product-like fields and coproduct-like alternatives; universal properties explain why these encodings are canonical." %}

## 3. Functors and Natural Transformations

A functor maps objects and arrows while preserving identity and composition. In Haskell, this is the familiar pattern behind `fmap`:

```haskell
class Functor f where
  fmap :: (a -> b) -> f a -> f b
```

The laws are:

```haskell
fmap id        = id
fmap (g . f)   = fmap g . fmap f
```

Lists, `Maybe`, trees, readers, and many parser structures are functorial. The important question is not "is this a container?" but "does this construction act lawfully on arrows?"

A natural transformation translates one functor into another uniformly:

```haskell
forall a. F a -> G a
```

For example, `listToMaybe :: [a] -> Maybe a` changes structure without inspecting what type `a` is. Parametricity is doing real design work here: a truly polymorphic transformation has fewer ways to cheat.

## 4. Exponentials, Representability, and Yoneda

Function types are exponentials. Currying is not just syntax:

```haskell
curry   :: ((a, b) -> c) -> a -> b -> c
uncurry :: (a -> b -> c) -> (a, b) -> c
```

It expresses a structural equivalence between maps out of products and maps into function spaces.

Representable functors make indexing explicit. A pair can be represented as a function from two positions:

```haskell
data Pair a = Pair a a

index :: Pair a -> Bool -> a
tabulate :: (Bool -> a) -> Pair a
```

The Yoneda lemma explains why a polymorphic function of shape

```haskell
forall x. (a -> x) -> F x
```

is determined by a value of type `F a`. For programmers, the practical message is that polymorphism and naturality restrict behavior so strongly that some abstractions are fully characterized by how they map.

{% include figure.html image="/assets/img/posts/category-theory/yoneda-programmer-view.svg" alt="Yoneda correspondence between a value in F a and a polymorphic mapper from a to x into F x." caption="Yoneda turns polymorphic mapping behavior into data: if behavior is natural, it is often determined by a small core value." %}

## 5. Adjunctions and Free Constructions

An adjunction relates two functors by a natural isomorphism:

$$
\operatorname{Hom}(Fa,b)\cong \operatorname{Hom}(a,Gb).
$$

Currying is a familiar example. Free and forgetful constructions are another. A forgetful functor removes structure; a free functor adds the minimal structure needed.

Lists are the free monoid on a type. If you know how to interpret one symbol into a monoid, there is a unique way to interpret a whole list by folding. This explains why lists, syntax trees, command logs, and parsers often separate description from interpretation.

{% include figure.html image="/assets/img/posts/category-theory/adjunction-free-forgetful.svg" alt="Free and forgetful adjunction showing raw generators becoming structured lists and structure being forgotten back to carriers." caption="Free/forgetful adjunctions explain a common software pattern: build syntax or structure freely, then interpret it through laws." %}

## 6. Monads: Sequencing Context Lawfully

A monad is a functor equipped with enough structure to sequence contextual computations. Programmer-facing operations include:

```haskell
return :: a -> m a
(>>=)  :: m a -> (a -> m b) -> m b
join   :: m (m a) -> m a
```

`Maybe` sequences failure, lists sequence nondeterminism, `Reader` sequences access to an environment, `State` sequences state threading, and `IO` sequences interactions with the external world.

The laws matter because they make refactoring safe. Sequencing should be associative, and `return` should act like identity. Categorically, a monad is a monoid in the category of endofunctors, with functor composition as the tensor product.

{% include figure.html image="/assets/img/posts/category-theory/monad-kleisli-sequencing.svg" alt="Monad diagram showing return, bind, join, and Kleisli composition for contextual functions." caption="Monads make contextual computation compositional: bind connects effectful arrows while preserving identity and associativity laws." %}

## What This Framework Lets Us Do

Category theory helps programmers name reusable structure: composition, data construction, mapping, natural translation, representation, adjunction, and effect sequencing. The payoff is not abstraction for its own sake; it is safer composition of software ideas.

## Where the Framework Stops Being Reliable

Real languages include nontermination, exceptions, mutation, compiler details, and runtime effects. Pedagogical categories such as `Hask` are useful approximations, not perfect mathematical universes. The laws still guide design, but implementations must be tested and documented.

## Where the Subject Leads Next

The next steps are applicative functors, monad transformers, profunctors, optics, algebraic effects, denotational semantics, type theory, and categorical logic.

## Technical and Editorial Audit

- Condensed a very long chapter-by-chapter essay into a programmer-facing path from composition to monads.
- Preserved Uppsala University reading-group attribution in the main text while avoiding a fabricated course code.
- Added original figures for composition laws, ADTs, Yoneda, adjunctions, and monadic sequencing.
- Kept Haskell snippets short and illustrative rather than exhaustive.
- Clarified the caveat that real programming languages only approximate the clean categorical setting.

## Main Sources Used in This Note

- Bartosz Milewski, _Category Theory for Programmers_.
- Uppsala University public Category Theory for Programmers reading-group page.
- S. Awodey, _Category Theory_.
- B. C. Pierce, _Basic Category Theory for Computer Scientists_.
